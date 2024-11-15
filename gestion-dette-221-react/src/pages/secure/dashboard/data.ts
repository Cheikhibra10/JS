export interface cardModel {
    stat: string;
    text: string;
    description?: string;
    icon?: string;
    pourcents?: string;
}

const datasCard: cardModel[] = [{
    icon: "fas fa-money-bill-wave text-xl",
    text: "Total Dettes",
    stat: "500.000 CFA",
    pourcents: "3.5"
},
{
    icon: "fas fa-users text-xl",
    text: "Clients",
    stat: "120",
    pourcents: "3.5" 
},
{
    icon: "fas fa-boxis text-xl",
    text: "Articles en Stock",
    stat: "2",
    pourcents: "3.5"
},
{
    icon: "fas fa-exclamation-circle text-xl",
    text: "Demandes en Cours",
    stat: "12",
    pourcents: "3.5"
}
]

export default datasCard;