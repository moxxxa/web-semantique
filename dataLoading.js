let baseRequests = "BASE <https://data.escr.fr/wiki/Liste_de_lunettes_et_d'opticiens#>";
let allClassItemRequest = baseRequests + "SELECT * WHERE { ?s a <className> .}";
let getInfoOpticienRequest = baseRequests + "PREFIX ex: <http://www.example.org/> SELECT * WHERE { ex:ID ?p ?v . }";

let opticiens_list = [];
let lunettes_list = [];
let composant_list = [];


let endpoint = "https://data.escr.fr/sparql";
let example_prefix = 'http://www.example.org/'


function callBackTwo(data, id) {
    let name_object = "";
    let list_object = [];
    let price = null;
    let lunette_composant = null;
    let verre_composant = null;

    $.each(data.results.bindings, function(index, bs) {
        if(bs.v.type === "literal") {
            name_object = bs.v.value
        }
        else{
            if(bs.p.value.toString().includes("LunettePrice")) {
                price = deleteExamplePrefix(bs.v.value)
            }
            else if(bs.p.value.toString().includes("Composant")) {
                lunette_composant =  deleteExamplePrefix(bs.v.value)
            }
            else if(isOpticienTable(bs.p.value)) {
                list_object.push(deleteExamplePrefix(bs.v.value));
            }
        }
    });

    if(price !== null) {
        lunettes_list.push(mapNewLunette(id, name_object, price, list_object))
    }
    else if(lunette_composant !== null) {
        composant_list.push(mapNewComposant(id, name_object, lunette_composant))
    }
    else{
        opticiens_list.push(mapNewOpticien(id, name_object, list_object))
    }
}


function queryLoad(callBackSuccess, request, idRequest) {
    current_request = request

    if(idRequest !== null){
        current_request = current_request.replace('ID', idRequest);
    }

    $.ajax({
        url: endpoint,
        dataType: 'json',
        async: false,
        data: {
            queryLn: 'SPARQL',
            query: current_request ,
            limit: 'none',
            infer: 'true',
            Accept: 'application/sparql-results+json'
        },

        success:function (response) {
            (idRequest === null) ? callBackSuccess(response) : callBackSuccess(response, idRequest)
        },

        error: displayError
    });
}


function callBackAll(data) {
    $.each(data.results.bindings, function(index, bs) {
        id_object = deleteExamplePrefix(bs.s.value);
        queryLoad(callBackTwo, getInfoOpticienRequest, id_object)
    });
}


function mapNewOpticien(id, name, lunettes) {
    opticien = {
        id: id,
        name: name,
        lunettes: []
    };

    for (const lun in lunettes) {
        lunette = {};
        lunette.id = lunettes[lun];
        opticien.lunettes.push(lunette)
    }
    return opticien;
}

function mapNewLunette(id, name, price, composants) {
    lunette = {
        id: id,
        name: name,
        composants: [],
        price: price
    };

    for (const cmp in composants) {
        composant = {};
        composant.id = composants[cmp];
        lunette.Composants.push(composant)
    }

    return lunette
}

function mapNewComposant(id, name, composant) {
    newComposant = {}
    newComposant.id = id
    newComposant.name = name
    newComposant.composant = composant
    return newComposant
}


/// Outils
function displayError(xhr, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
}

function deleteExamplePrefix(string) {
    return string.replace(example_prefix, '');
}

function isOpticienTable(value) {
    return value.toString().includes("opticienLunette") || value.toString().includes("LunetteComposants")
}

function prepare_data(typeName) {
    queryLoad(callBackAll, allClassItemRequest.replace('className', typeName), null);
    data = []
    switch (typeName) {
        case "Composant":
            data = composant_list;
            break;
        case "Lunette":
            data = lunettes_list;
            break;
        default:
            data = opticiens_list
    }
    return data
}
