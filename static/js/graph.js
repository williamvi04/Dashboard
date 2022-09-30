queue()
    .defer(d3.csv, "data/Pokemonv3.csv")
    .await(makeGraphs);

function makeGraphs(error, pokedata) {

    var ndx = crossfilter(pokedata);
    
    pokemon_selector(ndx);
    pokemon_stats(ndx);
    
    show_total_pokemon_volume(ndx);
    showHpLevel(ndx);
    showSpeedLevel(ndx);
    showAttackLevel(ndx);
    showDefenceLevel(ndx);
    showSpAttackLevel(ndx);
    showSpDefenceLevel(ndx);
    
    show_pokemon_height(ndx);
    show_pokemon_weight(ndx);
    
    show_pokemon_type(ndx);
   
    show_pokemon_gen(ndx);
    show_legendary_pokemon(ndx);
    show_pokemon_color(ndx);

    dc.renderAll();
}


function pokemon_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('name'));
    var group = dim.group();

    dc.selectMenu("#select-pokemon")
        .dimension(dim)
        .group(group);
}



function pokemon_stats(ndx) {
    var statsDimension = ndx.dimension(dc.pluck('total'));
    var statGroup = statsDimension.group().reduceCount();
    dc.barChart('#statsHisto')
        .width(768)
        .height(250)
        .x(d3.scale.linear().domain([180, 800]))
        .brushOn(true)
        .useViewBoxResizing(true)
        .transitionDuration(500)
        .elasticY(true)
        .dimension(statsDimension)
        .group(statGroup);
}



function show_total_pokemon_volume(ndx) {
    var totalPokemonGroup = ndx.groupAll('#');
    dc.numberDisplay("#pokemon-volume")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            if (d === 1) {
                $("#statsRow").show();
                return (+d);
            }
            else {
                $("#statsRow").hide();
                return (+d);
            }
        })
        .group(totalPokemonGroup);
}

function showHpLevel(ndx) {
    var hpLevel = ndx.groupAll().reduceSum(dc.pluck("hp"));
    dc.numberDisplay("#hitpoints")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(hpLevel)
        .formatNumber(d3.format(".2s"));
}


function showSpeedLevel(ndx) {
    var speedLevel = ndx.groupAll().reduceSum(dc.pluck("speed"));
    dc.numberDisplay("#speed")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(speedLevel)
        .formatNumber(d3.format(".2s"));
}


function showAttackLevel(ndx) {
    var attackLevel = ndx.groupAll().reduceSum(dc.pluck("attack"));
    dc.numberDisplay("#attack")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(attackLevel)
        .formatNumber(d3.format(".2s"));
}


function showDefenceLevel(ndx) {
    var defenceLevel = ndx.groupAll().reduceSum(dc.pluck("defence"));
    dc.numberDisplay("#defence")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(defenceLevel)
        .formatNumber(d3.format(".2s"));
}


function showSpAttackLevel(ndx) {
    var spAttackLevel = ndx.groupAll().reduceSum(dc.pluck("sp atk"));
    dc.numberDisplay("#spAttack")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(spAttackLevel)
        .formatNumber(d3.format(".2s"));
}


function showSpDefenceLevel(ndx) {
    var spDefenceLevel = ndx.groupAll().reduceSum(dc.pluck("sp def"));
    dc.numberDisplay("#spDefence")
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        })
        .group(spDefenceLevel)
        .formatNumber(d3.format(".2s"));
}




function show_pokemon_height(ndx) {
    var chartColors = d3.scale.ordinal()
        .range(['#ffdb58', '#4169e1']);
    var heightDim = ndx.dimension(function(d) {
        switch (true) {
            case (d.height == 0):
                return "0m";
            case (d.height < 5):
                return "0m to 5 feet";
            case (d.height < 15):
                return "5 to 15 feet";
            case (d.height < 25):
                return "15 to 25 feet";
            case (d.height >= 25):
                return "Over 25 feet";
        }
    });
    var heightGroup = heightDim.group();
    dc.barChart('#pokemon-height')
        .width(500)
        .height(350)
        .margins({ top: 15, right: 40, bottom: 40, left: 40 })
        .dimension(heightDim)
        .group(heightGroup)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(chartColors)
        .elasticY(true)
        .useViewBoxResizing(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('')
        .yAxis().ticks(4);
}

function show_pokemon_weight(ndx) {
    var chartColors = d3.scale.ordinal()
        .range(['#ffdb58', '#4169e1']);
    var weightDim = ndx.dimension(function(d) {
        switch (true) {
            case (d.weight == 0):
                return "0m";
            case (d.weight < 50):
                return "0m to 50 lbs";
            case (d.weight < 150):
                return "50 to 150 lbs";
            case (d.weight < 250):
                return "150 to 250 lbs";
            case (d.weight >= 250):
                return "Over 250 lbs";
        }
    });

    var weightGroup = weightDim.group();
    dc.barChart('#pokemon-weight')
        .width(500)
        .height(350)
        .margins({ top: 15, right: 40, bottom: 40, left: 40 })
        .dimension(weightDim)
        .group(weightGroup)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(chartColors)
        .elasticY(true)
        .useViewBoxResizing(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('')
        .yAxis().ticks(4);
}


function show_pokemon_type(ndx) {
    var typeDim = ndx.dimension(dc.pluck('type1'));
    var typeGroup = typeDim.group();
    dc.rowChart('#pokemon-type')
        .width(900)
        .height(400)
        .margins({ top: 10, right: 20, bottom: 40, left: 20 })
        .dimension(typeDim)
        .group(typeGroup)
        .label(function(d) {
            return d.key + " : " + d.value + " - " + (d.value / ndx.groupAll().reduceCount().value() * 100).toFixed(2) + "%";
        })
        .useViewBoxResizing(true)
        .transitionDuration(500);
}


function show_pie_percentage(key, endAngle, startAngle) {
    var percent = dc.utils.printSingleValue((endAngle - startAngle) / (2 * Math.PI) * 100);
    if (percent > 0) {
        return key + ' ' + Math.round(percent) + '%';
    }
}


function show_pokemon_gen(ndx) {
    var genDim = ndx.dimension(dc.pluck('generation'));
    var genGroup = genDim.group();
    dc.pieChart('#pokemon-gen-type')
        .height(300)
        .radius(90)
        .useViewBoxResizing(true)
        .transitionDuration(1500)
        .dimension(genDim)
        .group(genGroup);
}

function show_legendary_pokemon(ndx) {
    var chartColors = d3.scale.ordinal()
        .range(['red', 'green']);
    var legendaryDim = ndx.dimension(dc.pluck('legendary'));
    var legendaryGroup = legendaryDim.group();
    dc.pieChart('#legendary-pokemon')
        .height(300)
        .radius(90)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(chartColors)
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                return show_pie_percentage(d.data.key, d.endAngle, d.startAngle);
            });
        })
        .externalLabels(30)
        .drawPaths(true)
        .useViewBoxResizing(true)
        .transitionDuration(1500)
        .dimension(legendaryDim)
        .group(legendaryGroup);
}


function show_pokemon_color(ndx) {
    var chartColors = d3.scale.ordinal()
        .range(['blue', 'brown', 'purple', 'green', '#fffafa', 'grey', 'yellow', 'red', 'pink', 'orange', 'black', 'gold']);
    var colorDim = ndx.dimension(dc.pluck('color'));
    var colorGroup = colorDim.group();
    dc.pieChart('#pokemon-color')
        .height(300)
        .radius(90)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(chartColors)
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                return show_pie_percentage(d.data.key, d.endAngle, d.startAngle);
            });
        })
        .externalLabels(25)
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .cap(9)
        .useViewBoxResizing(true)
        .transitionDuration(1500)
        .dimension(colorDim)
        .group(colorGroup);
}
