

function display_opticien_table(opticien){
    row = "<td>" + opticien.id + "</td>"
    row += "<td>" + opticien.name + "</td>"
    row += "<td>"
    for (const lunette in opticien.lunettes) {
        onclick_request = "selected_lunette('".concat('', opticien.lunettes[lunette].id).concat('', "')")
        row += '<p class="text-primary onclick" onclick="' + onclick_request + '">' + opticien.lunettes[lunette].id  + "</p>"
    }
    row += "</td>"
    $('#opticienTab tr:last').after('<tr>' + row + '</tr>');
}

function selected_lunette(id){
    var lunette = get_obj_by_id(lunettes_list, id);

    document.getElementById("selectedLunetteId").innerHTML = id;
    document.getElementById("selectedLunetteName").innerHTML = lunette.id;

    var lunette_composant = composant_by_list(lunette.Composants);

    document.getElementById("selectedLunetteComposant").innerHTML = lunette_composant.length;

    display_composant_by_list(lunette_composant);
}

function display_composant_by_list(lunette_composant){

    $('#composantTab tr:not(:first)').remove();

    for (const cmp in lunette_composant) {
        composant = lunette_composant[cmp]
        row = "<td>" + composant.id + "</td>";
        row += "<td>" + composant.name + "</td>";
        row += "<td>" + composant.composant + "</td>";

        $('#composantTab tr:last').after('<tr>' + row + '</tr>');
    }
}





function composant_by_list(id_list){
    var composant_lunette = [];

    for (const obj in id_list) {
        cmp = get_obj_by_id(composant_list, id_list[obj].id);
        composant_lunette.push(cmp)
    }

    return composant_lunette
}



function get_obj_by_id(list, id){
    retour = {}
    for (const obj in list) {
        if(list[obj].id === id){
            retour = list[obj]
        }
    }
    return retour
}


function display_data(opticiens, lunettes, composants) {
    opticiens_list = opticiens;
    lunettes_list = lunettes;
    composant_list = composants;

    for (const opticien in opticiens_list) {
        display_opticien_table(opticiens_list[opticien])
    }
}
