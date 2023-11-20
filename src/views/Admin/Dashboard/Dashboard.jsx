import React from 'react';
import { Row, Col, Card } from 'antd';
import LineReservation from './LineReservation'; 
import PieChartUser from './PieChartUser'; 
import PieChartAccommodation from './PieChartAccommodation';
import RatingBarChart from './RatingBarChart';

const DashboardWithCharts = () => {
  return (
    <>
      <div>Dashboard</div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Reservaciones hechas por mes" style={{ marginBottom: 16 }}>
            <LineReservation />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Calificaciones a los alojamientos totales" style={{ marginBottom: 16 }}>
            <RatingBarChart />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Promedio de usuarios activos e inactivos" style={{ marginBottom: 16 }}>
            <PieChartUser />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Promedio alojamientos activos e inactivos" style={{ marginBottom: 16 }}>
            <PieChartAccommodation />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DashboardWithCharts;
