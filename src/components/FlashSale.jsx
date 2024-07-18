import { Row, Col } from 'antd';
import { Statistic } from 'antd';
const { Countdown } = Statistic;

const FlashSaleBanner = ({ deadline, navigate }) => {
  return (
    <Row
      gutter={[16, 16]}
      style={{
        backgroundColor: '#FF6F6F',
        borderRadius: '10px',
        // padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'100%',
        marginTop:20,
        marginLeft:2,
      }}
    >
      <Col>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: '0 0px 0 0', fontWeight: 'bold', color: 'white' }}>
            SIÊU HẠ GIÁ   <span style={{marginLeft: '10px',fontSize: '18px', color: 'black',marginBottom:'10px'}}>Kết thúc trong:</span>
          </h2>
          {deadline && (
            <Countdown
              value={deadline}
              format="HH:mm:ss"
              style={{ marginLeft: '0px', fontSize: '18px', color: 'black',fontWeight:'700' }}
            />
          )}
        </div>
      </Col>
      <Col>
        <span
          onClick={() => navigate('/books/discount')}
          style={{ color: 'white', cursor: 'pointer',alignItems:'center',fontSize:20,fontWeight:700 }}
        >
          Xem tất cả 
        </span>
      </Col>
    </Row>
  );
};

export default FlashSaleBanner;
