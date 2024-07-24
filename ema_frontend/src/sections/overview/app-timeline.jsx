import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Chart from 'src/components/chart';

const CHART_HEIGHT = 400;

const StyledChart = styled(Chart)(({ theme }) => ({
    height: CHART_HEIGHT,
    '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
        height: `100% !important`,
    }
}));

export default function TimelineChart({ title, subheader, data, ...other }) {
    const chartOptions = {
        chart: {
            type: 'scatter',
            zoom: {
                enabled: true,
                type: 'xy'
            }
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'End of Support Dates'
            },
            min: 1575072000000,
        },
        yaxis: {
            title: {
                text: 'No of Hostnames Affected'
            }
        },
        tooltip: {
          custom({series, seriesIndex, dataPointIndex, w}) {
              const point = w.globals.series[seriesIndex][dataPointIndex];
              const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
              return `<div class="custom-tooltip">
                  <span><b>${data.product}</b></span><br>
                  <span>Category: ${data.category}</span><br>
                  <span>Date: ${new Date(data.x).toLocaleDateString()}</span><br>
                  <span>Hostnames Affected: ${data.y}</span>
              </div>`;
          }
      },
        grid: {
            show: false
        },
        markers: {
            size: 8
        },
        legend: {
            show: true,
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        colors: data.map(series => series.color)
    };

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />
            <StyledChart
                type="scatter"
                series={data}
                options={chartOptions}
                width="100%"
                height={CHART_HEIGHT}
            />
        </Card>
    );
}

TimelineChart.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.array.isRequired,
};
