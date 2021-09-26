import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
import PieChart from '../chart/PieChart';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_client_list,
  api_query_client_column_setup,
  api_query_checkin_statistics
} from '../utils/api';

import '../scss/base.scss';
import '../scss/datachart.scss';

const MySwal = withReactContent(Swal);

const PageCheckinChart = function() {
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;

  if(!LoginInfo || !SToken) location.href = 'start.html';

  // 確認是否登入 && 檢查token是否有效
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

    if(LoginInfo && SToken) { 
      // 檢查 token 是否有效
      const formData = new FormData();
      formData.append('SToken', SToken);

      api_check_token(formData)
        .then(res => {
          const result = res.data;
          if(!result.Msg || result.Msg !== 'OK') {
            location.href = 'start.html';
          }
        })
        .catch(err => {
          location.href = 'start.html';
        });
    } else {
      location.href = 'start.html';
    }
  }, []);

  // ＊＊＊＊＊＊ initial Data ＊＊＊＊＊＊
  // Client List(dtColumns, dtList)
  const [columns, setColumns] = useState([]); // dtColumns

  // Client Column Setup
  const [clientColumnSetup, setClientColumnSetup] = useState()


  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const clientList = await api_query_client_list(formData);
      const clientColumnSetup = await api_query_client_column_setup(formData);

      if(clientList.data && clientList.data.Msg === 'OK'
        && clientColumnSetup.data && clientColumnSetup.data.Msg === 'OK')
      {
        // client list
        const {dtColumns} = clientList.data;
        setColumns([...dtColumns]);
        //setList([...dtList]);

        // client column setup
        const resClientColumnSetup = JSON.parse(clientColumnSetup.data.JSONContent);
        setClientColumnSetup([...resClientColumnSetup]);

        // 初始化 頁面資料
        initDataChart(dtColumns, resClientColumnSetup);

        MySwal.close();
      } else {
        MySwal.fire('Oops...', '系統發生錯誤', 'error');
      }
    } catch(err) {
      console.log(err);
      MySwal.fire('Oops...', '系統發生錯誤', 'error');
    };
  }
  
  useEffect(() => {
    initData();
  }, []);

  // 處理過的資料
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
        
        const res = await api_query_checkin_statistics(formData);
        if(res.data.rows && res.data.rows.length > 0) {
          console.log(res.data.rows);
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
  }

  const renderChart = () => {
    let chartDiv = [];
    if(chartArray && chartArray.length > 0) {
      chartDiv = chartArray.map((chart, index) => {
        return (
          <Container className="mb-100" key={index}>
            <div className="nowrap mr-3 align-center">{chart.Title} 分佈</div>
            <Col xs={12} className="d-flex display-7 mb-2 flex-column">
              <PieChart />
            </Col>
          </Container>
        );
      });

      return chartDiv;
    }
  }

  return (
    <Fragment>
      <HeaderDiv goBack={true} />
      
      <section className="wrapper-t content5 cid-rWWj23btGc mbr-parallax-background">
        <div className="mbr-overlay opacity-40"></div>
        <div className="media-container-row">
          <div className="title col-12 col-md-8">
            <h3 className="mbr-section-subtitle align-center mbr-white mbr-light pb-3 mbr-fonts-style display-2">
              <strong>賓客報到區間分析</strong>
            </h3>
          </div>
        </div>
      </section>
      
      <section className="extTable section-table cid-rWWj2DwwY0 pt-3">
        {renderChart()}
      </section>
    </Fragment>
  );
}

export default PageCheckinChart;
