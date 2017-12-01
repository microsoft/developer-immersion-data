import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CodeshareService } from './codeshare.service';
import { BookingService } from '../shared/booking.service';
import { ActivatedRoute } from '@angular/router';
import { Settings } from './settings';
import { AdalService } from 'ng2-adal/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { Popup } from 'ng2-opd-popup';



interface Metadata {
    properties?: any;
    outE?: any;
    inE?: any;
    to?: string;
    from?: string;
    type?: string;
    id?: string;
    label?: string;
    _displayLabel?: string;
}

enum PropertyPanelMode {
    Text,
    Json
}

@Component({
    providers: [CodeshareService],
    templateUrl: './codeshare.component.html'
})
export class CodeshareComponent implements OnInit {
    @Input('graphInMetatdata') graphInMetatdata: (Metadata)[];
    private networkContainer: HTMLElement;
    private network: Network;
    private graphMetadata: Metadata;
    private graphMetadataOriginal: Metadata;
    private searchString: string;
    private jsonPropertyContent: any;
    private flightId: string;
    private serviceName: string;
    codeshare: any;
    name: string;
    price: number;
    letters: string[];
    BookingReady: boolean;
    PurchaseReady: boolean;
    LoaderVisibility: boolean;
    physics = Settings.physicsSettings;
    iconGroups = Settings.defaultIconGroups;
    shapes = Settings.defaultShapes;
    sizableShapes = Settings.sizableShapes;
    selectedShape = this.shapes[0];
    selectedPhysics = 'forceAtlas2Based';

    constructor(private codeshareService: CodeshareService, private bookingService: BookingService, private adalService: AdalService, private route: ActivatedRoute, private _prevLocation: Location) {
        this.BookingReady = true;
        this.PurchaseReady = false;
        this.adalService.getUser().subscribe(
            res => {
                this.name = res.profile.name;
            },
            err => {
                console.log(err);
            }
        );
    }
    graphData: any;
    nodes: any;
    edges: any;
    nodeSize = "25";
    edgeSize = "1";
    iconSize = "25";

    collections: Array<string>;
    selectedCollection: string;
    collectionTitle: string;

    labelMappings: { [label: string]: string } = {};
    edgeColors: { [label: string]: string } = {};
    selectedLabelProperty: string;
    defaultLabelConstant = '__originalLabel__';
    noLabelConstant = '__noLabel__';
    PanelMode: PropertyPanelMode;
    
    //to show popup of node details
    @ViewChild('nodedetails') nodedetails: Popup;

    ngOnInit() {
        var container = document.getElementById('network');
        var serviceData = this.bookingService.codeshareSoloServiceData;
        if (typeof serviceData.serviceName != 'undefined' && serviceData.serviceName == "soloservice") { this.serviceName = "Solo Services"; }
        else if (typeof serviceData.serviceName != 'undefined' && serviceData.serviceName == "codeshare") { this.serviceName = "Code Share Partners"; }
        
        setTimeout(() => {
            this.codeshareService.get(serviceData.flightId, serviceData.serviceName).subscribe(
                res => {
                    this.graphData = res;
                    this.renderGraphNetwork(this.graphData);
                },
                err => {
                    console.log(err);
                }
            );
        }, 2500);
    }
    graphMetadataItems: any[];
    graphMetadataProperties: any[];

    private GoBackToFlightView()
    {
        this._prevLocation.back();
    }

    private click(params) {
        if (this.LoaderVisibility == true) {
            this.LoaderVisibility = false;
        }
        
        this.PanelMode = PropertyPanelMode.Text;
        //create empty object
        this.graphMetadata = {};
        if (params.nodes && params.nodes.length === 1) {
            var node = this.nodes.get(params.nodes[0]);
            var nodeDetails = node.data;
            this.jsonPropertyContent = nodeDetails;

            if (nodeDetails) {
                //this assign will take care of id, label, properties in a node
                Object.assign(this.graphMetadata, nodeDetails);

                this.graphMetadata._displayLabel = node.label;
                this.selectedLabelProperty = this.labelMappings[node._gLabel] || null;
                //this.setSelectedNodeSettings(nodeDetails.label);

                //flatten the properties from nodes - instead of xxxx: Array(1), made it xxxx: yyyyy
                if (nodeDetails.properties != null) {
                    this.graphMetadata.properties = {};
                    for (var kk in nodeDetails.properties) {
                        this.graphMetadata.properties[kk] = nodeDetails.properties[kk][0].value;
                    }
                }

                this.graphMetadata.type = "Vertex";
            }
        }
        else if (params.edges && params.edges.length === 1) {
            var edgeDetails = this.edges.get(params.edges[0]);
            this.jsonPropertyContent = edgeDetails.data;

            if (edgeDetails) {
                //this assign will take care of id, label in an edge
                Object.assign(this.graphMetadata, edgeDetails);

                //we need to move data.properties to properties
                if (edgeDetails.data && edgeDetails.data.properties) {
                    this.graphMetadata.properties = {};
                    for (var i in edgeDetails.data.properties) {
                        this.graphMetadata.properties[i] = edgeDetails.data.properties[i];
                    }
                }

                this.graphMetadata.from = this.nodes.get(edgeDetails.from).label;
                this.graphMetadata.to = this.nodes.get(edgeDetails.to).label;
                this.graphMetadata.type = "Edge";
            }
        }
        else {
            return;
        }

        if (Object.keys(this.graphMetadata).length === 0) {
            this.graphMetadata = null;
        }
        else {
            //copy graphMetadata object to an original one, graphMetadata will be modified on search and we need to keep a copy of the base one.
            this.graphMetadataOriginal = {};
            Object.assign(this.graphMetadataOriginal, this.graphMetadata);


        }
        this.searchString = '';
        this.nodedetails.options = {
            header: "Details",
            color: "#28aae1", // red, blue.... 
            widthProsentage: 40, // The with of the popou measured by browser width 
            animationDuration: 1, // in seconds, 0 = no animation 
            showButtons: true, // You can hide this in case you want to use custom buttons 
            confirmBtnContent: "", // The text on your confirm button 
            cancleBtnContent: "OK", // the text on your cancel button 
            confirmBtnClass: "sr-only", // your class for styling the confirm button 
            cancleBtnClass: "btn btn-md btn-primary", // you class for styling the cancel button 
            animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 

        };
        this.graphMetadataItems = [this.graphMetadata];
        this.graphMetadataProperties = [this.graphMetadata.properties];
        this.nodedetails.show(this.nodedetails.options);

    }

    //fetch label value of node
    private getLabelValue(node, property) {
        var label;

        switch (property) {
            case this.defaultLabelConstant:
                label = node.data.label;
                break;
            case this.noLabelConstant:
                label = '';
                break;
            default:
                label = node.data.properties[property][0].value;
                break;
        }

        return label;
    }

    //Render the network graph of Solo service and Codeshare
    renderGraphNetwork(data) {
        this.LoaderVisibility = true;
        this.nodes = new DataSet();
        this.edges = new DataSet();
        var container = document.getElementById('network');
        for (let obj of data) {
            if (obj.type == 'vertex' && !this.nodes.get(obj.id)) {
                var node = obj;
                //do not change _gLabel anywhere, this is the base gremlin node type
                let visNode = { id: node.id, label: node.label, _gLabel: node.label, data: node };

                if (this.iconGroups[node.label]) {
                    (visNode as any).group = node.label;
                }

                if (this.labelMappings[node.label]) {
                    visNode.label = this.getLabelValue(visNode, this.labelMappings[node.label]);
                }
                this.nodes.add(visNode);
            }
            else if (obj.type == 'edge' && !this.edges.get(obj.id)) {
                var edge = obj;
                var visEdge = { from: edge.outV, to: edge.inV, data: edge };

                (visEdge as any).hiddenLabel = edge.label;

                //uncomment if done with settings part
                //if (this.showEdgeLabel) {
                //    (visEdge as any).label = edge.label;
                //}

                if (this.edgeColors[edge.label]) {
                    (visEdge as any).color = { color: this.edgeColors[edge.label] };
                }
                this.edges.add(visEdge);
            }
        }
        var options = Settings.defaultGraphOptions;
        options.groups = this.iconGroups;
        options.nodes.shape = this.selectedShape;
        options.physics = this.physics[this.selectedPhysics];
        options.physics.stabilization =
            {
                iterations: 1250,
                updateInterval: 1
            };
        options.physics.minVelocity = 5;
        this.network = new Network(container, { nodes: this.nodes, edges: this.edges }, options);
        this.network.on('click', this.click.bind(this));
    }
}
