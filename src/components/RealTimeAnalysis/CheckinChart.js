import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DoughnutChart from '../../chart/DoughnutChart';

import Loading from '../../components/Loading';

import { 
  api_query_event_column_group_statistics
} from '../../utils/api';

import '../../scss/datachart.scss';

const MySwal = withReactContent(Swal);

const CheckinChart = (props) => {
  const {SToken, introImage, dtList, dtColumns, WPColumnSetup} = props;

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > 0 && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  // 初始化
  useEffect(() => {
    MySwal.fire({
      title: "",
      html: <Loading />,
      customClass: {
        popup: 'bg-transparent',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    initDataChart(dtColumns, WPColumnSetup);
  }, []);

  // 處理過的資料
  const [columns, setColumns] = useState([]);
  const [chartArray, setChartArray] = useState([]);

  const initDataChart = (dtColumns, clientColumnSetup) => {
    let newColumns = [...dtColumns];
    let newChart = [];

    newColumns.map((item, index) => {
      let obj = clientColumnSetup.find(clientItem => clientItem.Name === item.Name);
      item._wp = obj;

      const getQueryData = async () => {
        const formData = new FormData();
        formData.append('SToken', SToken);
        formData.append('DBColumnName', item.DBColumnName);
        
        const res = await api_query_event_column_group_statistics(formData);;
        if(res.data.rows && res.data.rows.length > 0) {
          let doughnutData = {
            Title: '',
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: ["rgba(254, 82, 91, 0.8)", "#b5b8ed", "#dedede", "#b5b8cf"],
              borderColor: ['#fff', '#fff','#fff', '#fff'],
              borderWidth: 2,
            }]
          };
          const rows = res.data.rows;
          rows.map(row => {
            doughnutData.labels.push(`${row.Label}：${row.Count}人`);
            doughnutData.datasets[0].data.push(row.Count);
          });

          doughnutData.Title = item.Name;
          newChart.push(doughnutData);
        }

        setChartArray([...newChart]);
      }

      if(obj.WP_IsAnalysis && obj.WP_IsAnalysis === 1) {
        getQueryData();
      }
    });

    setColumns([...columns, ...newColumns]);
    MySwal.close();
  }

  // render Chart
  const renderChart = () => {
    let chartDiv = [];
    if(chartArray && chartArray.length > 0) {
      chartDiv = chartArray.map((chart, index) => {
        return (
          <Col xs={6} key={index}>
            <Container className="mb-100">
              <div className="nowrap mr-3 align-center">{chart.Title} 分佈</div>
              <Col xs={12} className="d-flex display-7 mb-2 flex-column">
                <DoughnutChart chartData={chart} />
              </Col>
              <Col xs={12} className="mb-5">
                <hr />
              </Col>
            </Container>
          </Col>
        );
      });

      return chartDiv;
    }
  }
  
  return (
    <section className="features1 cid-rX4jzrRcmX bg-color-pink">
      <section className="extTable section-table cid-rWWj2DwwY0 bg-color-transparent pt-3">
        <Container>
          <Row>
            {renderChart()}
          </Row>
        </Container>
      </section>
    </section>
  );
}

export default CheckinChart;

