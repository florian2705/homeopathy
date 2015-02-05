
$(function () {
 
    $(document).ready(function () {
        $('#container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Remedy Fit'
            },
            
            xAxis: {
                categories: charttext,
                reversed: false,
                labels: {
                    step: 1
                }
            }
            ,
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return (this.value);
                    }
                },
  
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b> Remedy: ' +  this.point.category   + '</b><br/>' +
                        'Fit: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

            series: [ { name: 'Fit', data: chartdata } ]
        });
    });

});


