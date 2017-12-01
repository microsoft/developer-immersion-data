export interface IconDefinition
{
    face: string;
    code: string;
    size: number;
    color: string;
}

export interface IconGroup
{
    shape: string;
    icon: IconDefinition;
}

export class Settings
{
    constructor()
    {
        throw new Error("Cannot new this class");
    }

    static defaultShapes: Array<string> = ['box', 'ellipse', 'database', 'text', 'diamond', 'dot', 'star', 'triangle', 'triangleDown', 'square']

    static defaultColors: Array<string> = ['black', 'DarkGrey ', 'DarkRed', 'Red', 'Orange', 'Yellow', 'Green', 'Turquoise', 'Blue', 'Indigo', 'Purple', 'LightGray', 'crimson', 'LightPink', 'Gold', 'Lime', 'LightGreen', 'cornflowerblue']

    static sizableShapes: Array<string> = ['square', 'triangleDown', 'triangle', 'star', 'dot', 'diamond']

    static defaultIcons: Array<{ font: string, code: string }> = [
        { font: 'glyphicon', code: '\u2709' }, //envelope
        { font: 'glyphicon', code: '\u270f' }, //pencil
        { font: 'glyphicon', code: '\ue005' }, //heart
        { font: 'glyphicon', code: '\ue008' }, //user
        { font: 'glyphicon', code: '\ue009' }, //film
        { font: 'glyphicon', code: '\ue021' }, //house
        { font: 'glyphicon', code: '\ue022' }, //file
        { font: 'glyphicon', code: '\ue035' }, //headphones
        { font: 'glyphicon', code: '\ue041' }, //tag,
        { font: 'glyphicon', code: '\ue046' }, //camera
        { font: 'glyphicon', code: '\ue043' }, //book
        { font: 'glyphicon', code: '\ue118' }, //folder
        { font: 'glyphicon', code: '\ue116' }, //shopping cart
        { font: 'glyphicon', code: '\ue145' }, //phone
        { font: 'glyphicon', code: '\ue139' }, //briefcase
        { font: 'glyphicon', code: '\ue135' }, //globe
        { font: 'glyphicon', code: '\ue060' }, //picture
        { font: 'glyphicon', code: '\ue023' }, //time
        { font: 'glyphicon', code: '\ue103' }, //leaf
        { font: 'glyphicon', code: '\ue200' }, //tree
        { font: 'glyphicon', code: '\ue225' }, //piggy-bank
        { font: 'glyphicon', code: '\ue233' }, //graduation cap,
        { font: 'CommercialGraphIcons', code: '\uE90B' }, //organization
        { font: 'CommercialGraphIcons', code: '\uE903' }, //agreement
        { font: 'CommercialGraphIcons', code: '\uE8FB' }, //asset position
        { font: 'CommercialGraphIcons', code: '\uE910' }, //subscription
        { font: 'CommercialGraphIcons', code: '\uE900' }, //tenant
        { font: 'CommercialGraphIcons', code: '\uE907' }, //enterpriseoffer
        { font: 'CommercialGraphIcons', code: '\uE90F' }, //serviceplan
        { font: 'CommercialGraphIcons', code: '\uE901' }, //paws
        { font: 'CommercialGraphIcons', code: '\uE904' }, //soccer ball
        { font: 'CommercialGraphIcons', code: '\uE905' }, //wight lifting

        null //empty
    ]

    static physicsSettings: { [name: string]: any } =
    {
        default:
        {
            //barnesHut with some default settings is VisJs setting
        },
        repulsion:
        {
            solver: 'repulsion'
        },
        forceAtlas2Based:
        {
            forceAtlas2Based:
            {
                springLength: 100
            },
            solver: 'forceAtlas2Based'
        }
    }

    static defaultIconGroups: { [name: string]: IconGroup } =
    {
        Organization:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE90B',
                size: 25,
                color: '#525252'
            }
        },
        Agreement:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE903',
                size: 25,
                color: '#006837'
            }
        },
        AssetPosition:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE8FB',
                size: 25,
                color: '#006837'
            }
        },
        EnterpriseSubscription:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE910',
                size: 25,
                color: '#1964bc'
            }
        },
        Tenant:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE900',
                size: 25,
                color: '#1964bc'
            }
        },
        EnterpriseOffer:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE907',
                size: 25,
                color: '#1964bc'
            }
        },
        ServicePlan:
        {
            shape: 'icon',
            icon:
            {
                face: 'CommercialGraphIcons',
                code: '\uE90F',
                size: 25,
                color: '#1964bc'
            }
        }
    }

    static defaultGraphOptions: vis.Options =
    {
        nodes:
        {
            shape: Settings.defaultShapes[0]
        },
        edges:
        {
            font:
            {
                size: 10
            },
            arrows:
            {
                to:
                {
                    enabled: true,
                    scaleFactor: 0.45
                },
                from: false
            },
            smooth:
            {
                enabled: true,
                type: 'continuous',
                roundness: 0.5
            },
            color:
            {
                color: '#adadad'
            }
        },
        interaction:
        {
            hover: true,
            hoverConnectedEdges: true
        },
        layout:
        {
            improvedLayout: false
        },
        physics: Settings.physicsSettings['forceAtlas2Based']
    }
}