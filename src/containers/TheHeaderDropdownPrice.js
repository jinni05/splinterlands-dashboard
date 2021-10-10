import React, { useState, useEffect } from 'react';
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
const axios = require('axios');


const TheHeaderDropdownPrice = () => {
  const [priceDEC, setPriceDEC] = useState(null);
  const [priceSPS, setPriceSPS] = useState(null);

  useEffect(() => {
    setInterval(() => {
      getToken();
    }, 10000);
  }, []);
  const getToken = async () => {
    const responseDEC = await axios.get('https://api.coingecko.com/api/v3/coins/dark-energy-crystals');
    const responseSPS = await axios.get('https://api.coingecko.com/api/v3/coins/splinterlands');
    setPriceDEC(responseDEC.data.market_data.current_price.usd);
    setPriceSPS(responseSPS.data.market_data.current_price.usd);
  };

  return (
    <div>
      {(() => {
        if (priceDEC != null && priceSPS != null) {
          return (
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center' }}>
              <div className='mr-1'>
                <img
                  src={window.location.origin + '/assets/sps.png'}
                  width='20'
                  height='20'
                  alt="Splinterlands"
                />
              </div>
              <div className='mr-2' style={{ color: 'rgb(122, 110, 170)', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>${priceSPS}</div>

              <div className='mr-1'>
                <img
                  src={window.location.origin + '/assets/dec.png'}
                  width='20'
                  height='20'
                  alt="Dark Energy Crystals"
                />
              </div>
              <div style={{ color: 'rgb(122, 110, 170)', fontSize: '16px', fontWeight: '600', lineHeight: '1.5' }}>${priceDEC}</div>
            </div>
          )
        }
        return null;
      })()}
    </div>
  )
}

export default TheHeaderDropdownPrice