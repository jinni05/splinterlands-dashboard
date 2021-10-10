import React from 'react'
import {
  CRow,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';

export default class GameSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [], details: [] };
  }

  componentDidMount() {
  }


  render() {
    return (
      <>
        <CCard>
          <CCardHeader>
            RPC Nodes
          </CCardHeader>
          <CCardBody>
            <CRow>

            </CRow>
          </CCardBody>
        </CCard>
      </>
    )
  }
}
