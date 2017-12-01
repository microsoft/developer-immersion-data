/// <reference path="../../../../node_modules/@types/vis/index.d.ts" />
import { HttpClient, json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Settings } from './settings';
import { Console } from '../console/console';
import { Guide } from '../guide/guide';
import { viewEngineHooks } from 'aurelia-templating';

declare var vis: any;

interface SavedQuery
{
    id: string;
    title: string;
    query: string;
}

interface Metadata
{
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

enum PropertyPanelMode
{
    Text,
    Json
}

enum SettingsPanelMode
{
    Node,
    Edge
}

@inject(HttpClient, EventAggregator)
export class Network
{
    private network: vis.Network;
    private networkContainer: HTMLElement;
    private showConsoleButton: HTMLElement;
    private theConsole: Console;
    private graphMetadata: Metadata;
    private graphMetadataOriginal: Metadata;
    private http: HttpClient;
    private searchString: string;
    private jsonPropertyContent: any;

    PanelMode: PropertyPanelMode;
    SettingsMode: SettingsPanelMode;
    modalTypes = { None: 0, SaveQuery: 1, LoadQuery: 2, AddCollection: 3 };
    selectorTypes = { None: 0, Color: 1, Icon: 2 };
    modal = this.modalTypes.None;
    selector = this.selectorTypes.None;
    showEdgeLabel = false;

    defaultLabelConstant = '__originalLabel__';
    noLabelConstant = '__noLabel__';

    progressPercent: number;
    progressValue = 0;
    progressText: string;
    loading = false;
    showConfiguration = false;
    redrawOnQuery = true;

    iconGroups = Settings.defaultIconGroups;
    physics = Settings.physicsSettings;
    icons = Settings.defaultIcons;
    colors = Settings.defaultColors;
    shapes = Settings.defaultShapes;
    sizableShapes = Settings.sizableShapes;
    selectedShape = this.shapes[0];
    selectedPhysics = 'forceAtlas2Based';
    selectedNodeType: string;
    selectedEdgeType: string;
    selectedQueryId: string = null;
    selectedNodeIcon : string = null;
    selectedNodeIconFont: string = null;
    selectedNodeColor: string = null;
    savedQueries: Array<SavedQuery>;
    query = 'g.V(); g.E()';
    queryTitle: string;
    selectedQuery: SavedQuery;
    nodeTypeSettings: any; //all available Node Types in the displayed graph
    edgeTypeSettings: any; //all available Edge Types in the displayed graph

    //bound to inputs, reason for string type
    nodeSize = "25";
    edgeSize = "1";
    iconSize = "25";

    collections: Array<string>;
    selectedCollection: string;
    collectionTitle: string;

    labelMappings: { [label: string]: string } = {};
    edgeColors: { [label: string]: string } = {};
    selectedLabelProperty: string;

    nodes: any;
    edges: any;

    constructor(http: HttpClient, eventAggregator: EventAggregator)
    {
        this.http = http;
        this.getCollections();

        eventAggregator.subscribe('consoleupdate', response =>
        {
            this.showConsoleButton.classList.add('pulseAnimation');
            setTimeout(() =>
            {
                this.showConsoleButton.classList.remove('pulseAnimation');
            }, 300);
        });
    }

    executeQuery()
    {
        this.resetUi();

        this.progressText = "Querying DocumentDB";
        this.loading = true;
        this.http.fetch(`api/gremlin?query=${this.query}&collectionId=${this.selectedCollection}`)
            .then((response: any) => { return this.handleErrors(response); })
            .then(result => result.json())
            .then((data: any) =>
            {
                if (data && data.length)
                {
                    var dataForDisplay = [];
                    for (let query of data)
                    {
                        this.theConsole.write(query.queryText);

                        if (query.queryResult && query.queryResult.length)
                        {
                            this.theConsole.write(query.queryResult, false)
                        }
                        else
                        {
                            this.theConsole.write('No data returned from query', false);
                        }

                        dataForDisplay = dataForDisplay.concat(query.queryResult);
                    }

                    if (this.redrawOnQuery)
                    {
                        this.renderNetwork(dataForDisplay);
                    }
                    else
                    {
                        this.nicelyEndLoading(true);
                    }
                }
                else
                {
                    this.nicelyEndLoading(true);
                }
            })
            .catch((error) =>
            {
                this.theConsole.write(error, false);
                this.nicelyEndLoading(true);
            });
    }

    launchConfiguration()
    {
        this.refreshNodeTypeSettings(true);
        this.refreshEdgeTypeSettings(true);
        this.SettingsMode = SettingsPanelMode.Node;
        this.showConfiguration = true;
    }

    shapeChange()
    {
        this.network.setOptions({ nodes: { shape: this.selectedShape } });
        this.saveCurrentSettings();
    }

    sizeChange(event, type)
    {
        if (type != 'icons') //nodes/edges
        {
            this.setNodeOrEdgeSize(type, event.target.value);
        }
        else
        {
            this.setIconSize(event.target.value);
        }

        this.saveCurrentSettings();
    }

    physicsChange()
    {
        this.network.setOptions({ physics: this.physics[this.selectedPhysics] });
        this.saveCurrentSettings();
    }

    changeIconSetting(type, setting)
    {
        this.selectedNodeType = type;

        if (setting == 'color' && !this.iconGroups[this.selectedNodeType])
        {
            alert('no icon set yet, cannot change color');
        }
        else
        {
            this.selector = setting == 'color' ? this.selectorTypes.Color : this.selectorTypes.Icon;
        }
    }

    changeEdgeColor(type)
    {
        this.selectedEdgeType = type;
        this.selector = this.selectorTypes.Color;
    }

    iconSelected(icon)
    {
        this.addIconGroup(this.selectedNodeType, icon);
        this.changeNodeIconGroup(this.selectedNodeType, icon);

        this.selectedNodeType = null;
        this.selector = this.selectorTypes.None;

        this.refreshNodeTypeSettings();
    }

    colorSelected(color)
    {
        if (this.SettingsMode == SettingsPanelMode.Edge)
        {
            this.edgeColorSelected(color);
            this.edgeColors[this.selectedEdgeType] = color;
            this.refreshEdgeTypeSettings();
        }
        else
        {
            this.iconGroups[this.selectedNodeType].icon.color = color;
            this.network.setOptions({ groups: this.iconGroups });

            this.refreshNodeTypeSettings();
        }

        this.selector = this.selectorTypes.None;
    }

    edgeColorSelected(edgeColor)
    {
        let edges = this.edges.get({ filter: x => x.hiddenLabel == this.selectedEdgeType });
        for (let edge of edges)
        {
            edge["color"] = { color: edgeColor };
        }

        this.edges.update(edges);
    }

    labelChange()
    {
        var type = this.graphMetadata.label;
        this.labelMappings[type] = this.selectedLabelProperty;

        //get all nodes of this type, update label to new property
        var nodes = this.nodes.get({ filter: x => x.data.label == type });
        for (let node of nodes)
        {
            node.label = this.getLabelValue(node, this.selectedLabelProperty);

            this.graphMetadata._displayLabel =
                this.selectedLabelProperty == this.noLabelConstant ?
                    node.data.label :
                    node.label;
        }

        this.nodes.update(nodes);
        this.saveCurrentSettings();
    }

    collectionChange()
    {
        this.query = 'g.V(); g.E()';
        this.resetUi();
        this.theConsole.clear();
        this.getSavedQueries();
        this.getSavedSettings();
    }

    private setNodeOrEdgeSize(type, value)
    {
        var opts = {};
        opts[type] = {};
        opts[type][type == 'nodes' ? 'size' : 'width'] = parseInt(value);

        this.network.setOptions(opts);
    }

    private setIconSize(value)
    {
        for (let iconGroup in this.iconGroups)
        {
            this.iconGroups[iconGroup].icon.size = parseInt(value);
        }

        this.network.setOptions({ groups: this.iconGroups });
    }

    private getLabelValue(node, property)
    {
        var label;

        switch (property)
        {
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

    private refreshNodeTypeSettings(dontSave?: boolean)
    {
        this.nodeTypeSettings = [];

        let types = this.nodes.distinct('_gLabel');

        for (let type of types)
        {
            let group = this.iconGroups[type];

            this.nodeTypeSettings.push({
                type: type,
                font: group ? group.icon.face : null,
                icon: group ? group.icon.code : null,
                color: group ? group.icon.color : null
            });
        }
        if (this.graphMetadata)
        {
            this.setSelectedNodeSettings(this.graphMetadata.label);
        }
        
        if (!dontSave)
        {
            this.saveCurrentSettings();
        }
    }


    private refreshEdgeTypeSettings(dontSave?: boolean)
    {
        this.edgeTypeSettings = [];

        let types = this.edges.distinct('hiddenLabel');

        for (let type of types)
        {
            let col = this.edgeColors[type];
            this.edgeTypeSettings.push({
                type: type,
                color: col
            })
        }

        if (!dontSave)
        {
            this.saveCurrentSettings();
        }
    }

    //change visjs nodes group to existing group
    private changeNodeIconGroup(type, icon) {
        let nodes = this.nodes.get({ filter: x => x._gLabel == type });

        for (let node of nodes)
        {
            if (icon)
            {
                node.group = type;
            }
            else
            {
                delete node.group;
            }
        }

        this.nodes.update(nodes);
    }

    private changeEdgeLabelVisibility()
    {
        let allEdges = this.edges.get();
        for (let edge of allEdges)
        {
            edge.label = this.showEdgeLabel ? edge.hiddenLabel : undefined;
        }

        this.edges.update(allEdges);
    }

    //add new group to visjs groups
    private addIconGroup(groupName, icon)
    {
        if (icon)
        {
            var font = icon.font == 'glyphicon' ? 'Glyphicons Halflings' : icon.font;

            //if group exists, just update icon, don't overwrite colors
            if (this.iconGroups[groupName])
            {
                this.iconGroups[groupName].icon.face = font;
                this.iconGroups[groupName].icon.code = icon.code;
            }
            else
            {
                this.iconGroups[groupName] =
                {
                    shape: 'icon',
                    icon:
                    {
                        face: font,
                        code: icon.code,
                        size: parseInt(this.iconSize),
                        color: 'black'
                    }
                }
            }

        }
        else //remove icon
        {
            if (this.iconGroups[groupName])
            {
                //vis.js has a bug and remember the groups assigned to its nodes
                //so if you don't do that it does not change the icon.
                this.iconGroups[groupName].shape = this.selectedShape;
                delete this.iconGroups[groupName];
            }
        }
        this.network.setOptions({ groups: this.iconGroups });
    }

    private renderNetwork(data)
    {
        this.progressText = 'Parsing Document DB Result';

        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();

        for (let obj of data)
        {
            if (obj.type == 'vertex' && !this.nodes.get(obj.id))
            {
                var node = obj;

                //do not change _gLabel anywhere, this is the base gremlin node type
                let visNode = { id: node.id, label: node.label, _gLabel: node.label, data: node };

                if (this.iconGroups[node.label])
                {
                    (visNode as any).group = node.label;
                }

                if (this.labelMappings[node.label])
                {
                    visNode.label = this.getLabelValue(visNode, this.labelMappings[node.label]);
                }

                this.nodes.add(visNode);
            }
            else if (obj.type == 'edge' && !this.edges.get(obj.id))
            {
                var edge = obj;

                var visEdge = { from: edge.outV, to: edge.inV, data: edge };

                (visEdge as any).hiddenLabel = edge.label;

                if (this.showEdgeLabel)
                {
                    (visEdge as any).label = edge.label;
                }

                if (this.edgeColors[edge.label])
                {
                    (visEdge as any).color = { color: this.edgeColors[edge.label] };
                }

                this.edges.add(visEdge);
            }
        }

        if (!this.nodes.get().length)
        {
            //no vertices to render, end loading, show console
            this.nicelyEndLoading(true);
        }

        this.progressText = 'Stabilizing Graph Visualization';

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

        this.network = new vis.Network(this.networkContainer, { nodes: this.nodes, edges: this.edges }, options);

        //set persisted values
        this.setIconSize(this.iconSize);
        this.setNodeOrEdgeSize('nodes', this.nodeSize);
        this.setNodeOrEdgeSize('edges', this.edgeSize);

        this.network.on('click', this.click.bind(this));

        this.network.on('hoverEdge', this.hoverEdge.bind(this, true));

        this.network.on('blurEdge', this.hoverEdge.bind(this, false));

        this.network.on("stabilizationProgress", (params) =>
        {
            this.progressPercent = params.iterations / params.total;
            this.progressValue = Math.floor(this.progressPercent * 100);
        });

        this.network.once("stabilizationIterationsDone", (params) =>
        {
            this.nicelyEndLoading();
        });
    }

    private nicelyEndLoading(noGraphRendered?: boolean)
    {
        this.progressPercent = 1;
        this.progressValue = 100;

        setTimeout(() =>
        {
            this.loading = false;

            if (noGraphRendered && !this.theConsole.IsVisible)
            {
                this.theConsole.default();
            }
        }, 500);
    }

    /* manipulating collection methods */
    private getCollections()
    {
        this.http.fetch('api/collection')
            .then((response: any) => { return this.handleErrors(response); })
            .then(result => result.json())
            .then((data: any) =>
            {
                this.collections = data;
                if (this.collections && this.collections.length > 0)
                {
                    if (this.collectionTitle)
                    {
                        this.selectedCollection = this.collectionTitle;
                        this.collectionTitle = '';
                    }
                    else
                    {
                        this.selectedCollection = this.collections[0];
                    }
                    this.getSavedQueries();
                    this.getSavedSettings();
                }
            })
    }

    private handleErrors(response)
    {
        if (!response.ok)
        {
            response.json().then(
                (json =>
                {
                    this.theConsole.write(json, false);
                    this.theConsole.default();
                }));

            throw "Error!!!";
        }
        return response;
    }

    private addCollection()
    {
        this.http.fetch(`api/collection?name=${this.collectionTitle}`, { method: 'post' })
            .then((response: any) => { return this.handleErrors(response);  })
            .then((response: any) => { this.getCollections(); })
        this.modal = this.modalTypes.None;
    }
    /* end manipulating collection methods */

    /* saved queries methods */
    private getSavedQueries()
    {
        this.http.fetch(`api/query?collectionId=${this.selectedCollection}`)
            .then((response: any) => { return this.handleErrors(response); })
            .then(result => result.json())
            .then((data: any) =>
            {
                this.savedQueries = [];

                if(data && data.length)
                {
                    this.savedQueries = data;
                    this.selectedQueryId = this.savedQueries[0].id;
                }                
            });
    }

    private loadSavedQuery()
    {        
        this.query = this.savedQueries.filter(x => x.id == this.selectedQueryId)[0].query;
        this.modal = this.modalTypes.None;
        this.executeQuery();
    }

    private deleteSavedQuery(id: string)
    {
        this.http.fetch(`api/query?id=${id}&collectionId=${this.selectedCollection}`, { method: 'delete' })
            .then((response: any) => { return this.handleErrors(response); })
            .then((response: any) => { this.getSavedQueries(); });
    }

    private saveCurrentQuery()
    {
        var postBody = { title: this.queryTitle, query: this.query };

        this.http.fetch(`api/query?collectionId=${this.selectedCollection}`, { method: 'post', body: json(postBody) })
            .then((response: any) => { return this.handleErrors(response); })
            .then((response: any) => {
                this.getSavedQueries();
            })
        this.queryTitle = '';
        this.modal = this.modalTypes.None;
    }
    /* end saved queries methods */

    /* saved settings methods */
    private getSavedSettings()
    {
        this.http.fetch(`api/settings?collectionId=${this.selectedCollection}`)
            .then((response: any) => { return this.handleErrors(response); })
            .then(result => result.json())
            .then((data: any) =>
            {
                if (data)
                {
                    this.iconGroups = data.iconGroups;
                    this.nodeSize = data.options.nodeSize;
                    this.edgeSize = data.options.edgeSize;
                    this.iconSize = data.options.iconSize;
                    this.labelMappings = data.options.labelMappings;
                    this.selectedShape = data.options.defaultNodeShape;
                    this.showEdgeLabel = data.showEdgeLabel;
                    this.selectedPhysics = data.options.physicsSolver;
                    this.edgeColors = data.options.edgeColors;
                }
                else
                {
                    this.iconGroups = Settings.defaultIconGroups;
                    this.nodeSize = "25";
                    this.edgeSize = "1";
                    this.iconSize = "25";
                    this.labelMappings = {};
                    this.selectedShape = this.shapes[0];
                    this.showEdgeLabel = false;
                    this.selectedPhysics = 'forceAtlas2Based';
                    this.edgeColors = {};
                }
            });
    }

    private saveCurrentSettings()
    {
       var postBody =
            {
                iconGroups: this.iconGroups,
                options:
                {
                    nodeSize: parseInt(this.nodeSize),
                    edgeSize: parseInt(this.edgeSize),
                    iconSize: parseInt(this.iconSize),
                    defaultNodeShape: this.selectedShape,
                    labelMappings: this.labelMappings,
                    physicsSolver: this.selectedPhysics,
                    edgeColors: this.edgeColors
                },
                showEdgeLabel: this.showEdgeLabel
            };

       this.http.fetch(`api/settings?collectionId=${this.selectedCollection}`, { method: 'post', body: json(postBody) })
           .then((response: any) => { return this.handleErrors(response); })
    }
    /* end saved settings methods */

    // resets the progressBar back to start,
    // destroys the network (if it exists)
    // clears out the DOM containing the network's configuration ui
    private resetUi()
    {
        this.showConfiguration = false;        
        this.selector = this.selectorTypes.None;
        this.modal = this.modalTypes.None;
        this.graphMetadata = null;
        this.progressValue = 0;
        this.progressPercent = 0;
        this.nodeTypeSettings = [];
        this.edgeTypeSettings = [];

        if (this.network && this.redrawOnQuery)
        {
            this.network.destroy();
            this.network = null;
        }
    }

    private hoverEdge(showLabel, params)
    {
        if (!this.showEdgeLabel)
        {
            var edge = this.edges.get(params.edge);
            edge.label = showLabel ? edge.hiddenLabel : undefined;

            this.edges.update(edge);
        }
    }

    private click(params)
    {        
        if (this.loading)
        {         
            return;
        }
        this.PanelMode = PropertyPanelMode.Text;
        //create empty object
        this.graphMetadata = {};

        if (params.nodes && params.nodes.length === 1)
        {
            var node = this.nodes.get(params.nodes[0]);
            var nodeDetails = node.data;
            this.jsonPropertyContent = nodeDetails;
            
            if (nodeDetails)
            {
                //this assign will take care of id, label, properties in a node
                Object.assign(this.graphMetadata, nodeDetails);

                this.graphMetadata._displayLabel = node.label;
                this.selectedLabelProperty = this.labelMappings[node._gLabel] || null;

                this.setSelectedNodeSettings(nodeDetails.label);
                
                //flatten the properties from nodes - instead of xxxx: Array(1), made it xxxx: yyyyy
                if (nodeDetails.properties != null)
                {
                    this.graphMetadata.properties = {};
                    for (var kk in nodeDetails.properties)
                    {
                        this.graphMetadata.properties[kk] = nodeDetails.properties[kk][0].value;
                    }
                }

                this.graphMetadata.type = "Vertex";
            }
        }
        else if (params.edges && params.edges.length === 1)
        {
            var edgeDetails = this.edges.get(params.edges[0]);
            this.jsonPropertyContent = edgeDetails.data;

            if (edgeDetails)
            {
                //this assign will take care of id, label in an edge
                Object.assign(this.graphMetadata, edgeDetails);

                //we need to move data.properties to properties
                if (edgeDetails.data && edgeDetails.data.properties)
                {
                    this.graphMetadata.properties = {};
                    for (var i in edgeDetails.data.properties)
                    {
                        this.graphMetadata.properties[i] = edgeDetails.data.properties[i];
                    }
                }

                this.graphMetadata.from = this.nodes.get(edgeDetails.from).label;
                this.graphMetadata.to = this.nodes.get(edgeDetails.to).label;
                this.graphMetadata.type = "Edge";
            }
        }

        //if the graphMetadata is empty - made it null
        if (Object.keys(this.graphMetadata).length === 0)
        {
            this.graphMetadata = null;
        }
        else
        {
            //copy graphMetadata object to an original one, graphMetadata will be modified on search and we need to keep a copy of the base one.
            this.graphMetadataOriginal = {};
            Object.assign(this.graphMetadataOriginal, this.graphMetadata);
        }
        this.searchString = '';
    }

    private doFilter(e)
    {
        var filter = e.target.value;

        var result: Metadata = {};
        result.type = this.graphMetadataOriginal.type;
        result.id = this.graphMetadataOriginal.id;
        result.label = this.graphMetadataOriginal.label;

        for (var i in this.graphMetadataOriginal.properties)
        {
            if (this.filterProperty(filter, i, this.graphMetadataOriginal.properties[i]))
            {
                if (!result.properties)
                {
                    result.properties = {};
                }
                result.properties[i] = this.graphMetadataOriginal.properties[i];
            }
        }

        //for nodes
        for (var prop of ["inE", "outE"])
        {
            for (var i in this.graphMetadataOriginal[prop])
            {
                if (this.filterProperty(filter, i, null))
                {
                    if (!result[prop]) 
                    {
                        result[prop] = {};
                    }
                    result[prop][i] = this.graphMetadataOriginal[prop][i];
                }
            }
        }

        //for edges
        for (var prop of ["from", "to"])
        {
            if (this.filterProperty(filter, this.graphMetadataOriginal[prop], null))
            {
                result[prop] = this.graphMetadataOriginal[prop];
            }
        }

        this.graphMetadata = result;
    }

    private filterProperty(filter, prop, value) 
    {
        return ((filter == null || filter === "") ||
            (filter &&
                (prop && prop.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
                    (value && value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1))));
    }

    private togglePropertyView()
    {
        if (this.PanelMode == PropertyPanelMode.Text)
        {
            this.PanelMode = PropertyPanelMode.Json
        }
        else
        {
            this.PanelMode = PropertyPanelMode.Text;
        }
    }

    private setSelectedNodeSettings(node)
    {
        if (this.iconGroups[node])
        {
            let selectedIconSettings = this.iconGroups[node].icon;
            this.selectedNodeIcon = selectedIconSettings.code;
            this.selectedNodeColor = selectedIconSettings.color;
            this.selectedNodeIconFont = selectedIconSettings.face;
        }
        else 
        {
            this.selectedNodeIcon = null;
            this.selectedNodeColor = null;
            this.selectedNodeIconFont = null;
        }
    }
}

//Class for iterating over object keys
//Used in a repeater where you need to bind to an object (not a simple array or list)
export class KeysValueConverter
{
    toView(obj)
    {
        if (obj)
        {
            var list = Object.keys(obj);
            return list;
        }
    }
}

@viewEngineHooks()
export class NetworkBinder
{
    beforeBind(view)
    {
        view.overrideContext.PropertyPanelMode = PropertyPanelMode;
        view.overrideContext.SettingsPanelMode = SettingsPanelMode;
    }
}