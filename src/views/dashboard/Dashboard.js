import React from 'react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CWidgetProgressIcon,
  CFormGroup,
  CInputGroup,
  CInput,
  CInputGroupAppend
} from '@coreui/react';
import CIcon from '@coreui/icons-react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { freeSet } from '@coreui/icons';

var jsonData = require('../../json/accountData.json');

const axios = require('axios');
const fields = [{
  key: 'No',
  label: '',
  _style: { width: '1%' },
  sorter: true,
  filter: false
},
  'name'
  , {
  key: 'rating',
  label: 'Rating',
  _style: { width: '7%' },
  sorter: true,
  filter: false
},
{
  key: 'collection_power',
  label: 'Power',
  _style: { width: '7%' },
  sorter: true,
  filter: false
},
{
  key: 'ecr',
  label: 'Last time rate',
  sorter: true,
  filter: false
},
{
  key: 'ecr_current',
  label: 'Current rate',
  sorter: true,
  filter: false
},
{
  key: 'last_reward_time',
  label: 'Last time played',
  sorter: true,
  filter: false
},
{
  key: 'dec',
  label: 'Dec',
  sorter: true,
  filter: false
},
{
  key: 'questClaimTrxID',
  label: 'Quest',
  sorter: true,
  filter: false
},
{
  key: 'cards',
  label: 'Collection',
  _style: { width: '1%' },
  sorter: true,
  filter: false
},

{
  key: 'refresh',
  label: '',
  _style: { width: '1%' },
  sorter: false,
  filter: false
}
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { accounts: [], details: [], info: false, transactionInfo: {}, questClaimTrxID: "", disabled: false, cardDetails: [] };
    this.reloadAccount = this.reloadAccount.bind(this);
  }

  //  componentDidMount
  async componentDidMount() {
    var secondUpdate = process.env.REACT_APP_AUTO_UPDATE || 30;
    var timeUpdate = secondUpdate * 1000;
    var accounts = jsonData;

    if (this.state.cardDetails.length === 0) {
      this.getCardDetails();
    }

    accounts.sort(function (a, b) { return a - b }).forEach(async (account, i) => {
      let [detailResponse, balanceResponse, questResponse, collectionResponse] = await Promise.all([
        axios.get(`https://api.splinterlands.io/players/details?name=${account.AccountName}`),
        axios.get(`https://api.splinterlands.io/players/balances?username=${account.AccountName}`),
        axios.get(`https://api.splinterlands.io/players/quests?username=${account.AccountName}`),
        axios.get(`https://api.splinterlands.io/cards/collection/${account.AccountName}`),
      ]);

      if (detailResponse.data.error != undefined && detailResponse.data.error.includes("not found.")) {
        toast.info(detailResponse.data.error);
        return null;
      }

      let indexDEC = balanceResponse.data.findIndex(x => x.token === "DEC");
      let indexECR = balanceResponse.data.findIndex(x => x.token === "ECR");
      let ecr_cal = ((detailResponse.data.capture_rate / 100) + ((new Date() - new Date(balanceResponse.data[indexECR].last_reward_time)) / (1000 * 60 * 60) * 1.041)).toFixed(2);

      let trsactionResponse;
      if (questResponse.data.length != 0 && questResponse.data[0].claim_trx_id != null) {
        trsactionResponse = await axios.get(`https://api.splinterlands.io/transactions/lookup?trx_id=${questResponse.data[0].claim_trx_id}`);
      }

      let data = {
        ...detailResponse.data,
        ...{
          dec: balanceResponse.data[indexDEC] == null ? 0 : balanceResponse.data[indexDEC].balance,
          No: i + 1,
          ecr: balanceResponse.data[indexECR] == null ? 0 : balanceResponse.data[indexECR].balance,
          ecr_current: ecr_cal > 100 ? 100 : ecr_cal,
          last_reward_time: balanceResponse.data[indexECR] == null ? 0 : balanceResponse.data[indexECR].last_reward_time
        },
        ...{
          questName: questResponse.data.length != 0 ? questResponse.data[0].name : '',
          questTotalItem: questResponse.data.length != 0 ? questResponse.data[0].total_items : 0,
          questCompleted: questResponse.data.length != 0 ? questResponse.data[0].completed_items : 0,
          questClaimTrxID: questResponse.data.length != 0 ? questResponse.data[0].claim_trx_id : null,
          questClaimDate: questResponse.data.length != 0 ? questResponse.data[0].claim_date : null,
          questRewards: questResponse.data.length != 0 ? questResponse.data[0].rewards : null,
        },
        ...{
          transactionInfo: trsactionResponse != undefined ? JSON.parse(trsactionResponse.data.trx_info.result).rewards : null,
          PostingKey: account.PostingKey
        },
        ...{
          cards: collectionResponse != null & collectionResponse.card != undefined ? collectionResponse.card : []
        }
      };

      await this.setState({
        accounts: [...this.state.accounts, data]
      });
    });

    setInterval(() => {
      accounts.forEach((account, index) => {
        this.reloadAccount(account.AccountName);
      })
    }, timeUpdate);
  }

  setInfo(value) {
    this.setState({ info: value });
  }

  // async getTransaction(trxid) {
  //   this.setInfo(!this.state.info);
  //   let [trxResponse] = await Promise.all([
  //     axios.get(`https://api.splinterlands.io/transactions/lookup?trx_id=${trxid}`)
  //   ]);
  //   await this.setState({ transactionInfo: JSON.parse(trxResponse.data.trx_info.result).rewards });
  // }

  rewardDetail(result) {
    if (result == '{}') {
      console.log("result " + result);
      return;
    }

    let arr = JSON.parse(result);
    if (arr == null || arr.length == 0) {
      console.log("arr " + arr);
      return;
    }

    let render = arr.map((item, i) => {
      let str = "";
      switch (item.type) {
        case "credits":
          str = <CCol sm="6" md="4" lg="3" className="mb-4 text-center" key={i}>
            <div>
              <img src={window.location.origin + `/assets/credits.png`} alt="credits" style={{ width: '135px' }} />
            </div>
            <div className="mt-2">
              <strong>{item.quantity + " CREDIT(S)"}</strong>
            </div>
          </CCol>
          break;
        case "potion":
          let image;
          let subImg;

          if (item.potion_type == "legendary") {
            image = <img style={{ width: '135px' }} src={window.location.origin + `/assets/potion_legendary.png`} alt="legendary" />
            subImg = item.quantity + " Legendary Potion";
          }
          else {
            image = <img style={{ width: '135px' }} src={window.location.origin + `/assets/potion_gold.png`} alt="gold" />
            subImg = item.quantity + " Alchemy Potion";
          }

          str = <CCol sm="6" md="4" lg="3" className="mb-4 text-center" key={i}>
            <div className="mt-5">
              {image}
            </div>
            <div className="mt-2">
              <strong>{subImg}</strong>
            </div>
          </CCol>
          break;
        case "reward_card":
          let cardImage;
          var card = this.state.cardDetails.filter(card => card.id == item.card.card_detail_id);
          cardImage = <img style={{ width: 200, height: 279 }} src={window.location.origin + `/assets/monster-sumoner-abi/${card[0] != undefined ? card[0].name.replace(" ", "-") : ""}.png`} alt={card[0] != undefined ? card[0].name : ""} />

          str = <CCol sm="6" md="4" lg="3" key={i} className="mb-4">
            <div className="position-relative card-image">
              {cardImage}
              {/* <div className="card-mana"><img src={window.location.origin + `/assets/monster-sumoner-abi/stat-mana.png`} className="icona" /><span>2</span></div> */}
              <div className="card-name">{card[0] != undefined ? card[0].name : ""}</div>
            </div>
          </CCol>
          break;
      }

      return str;
    })

    return render;
  }

  async getCardByUID(uid) {
    return await axios.get(`https://api.splinterlands.io/cards/find?ids=${uid}`)
      .then(response => {
        return response.data[0].details;
      })
      .catch(function (error) { console.log(error) });
  }

  getCardDetails() {
    axios.get(`https://api.splinterlands.io/cards/get_details`)
      .then(response => {
        this.setState({ cardDetails: response.data });
      })
      .catch(function (error) { console.log(error) });
  }

  renderType(type) {
    switch (type) {
      case 'credits':

        break;

      default:
        break;
    }
  }

  async reloadAccount(accountName) {
    this.setState({ disabled: true });

    let [detailResponse, balanceResponse, questResponse] = await Promise.all([
      axios.get(`https://api.splinterlands.io/players/details?name=${accountName}`),
      axios.get(`https://api.splinterlands.io/players/balances?username=${accountName}`),
      axios.get(`https://api.splinterlands.io/players/quests?username=${accountName}`),
    ]);

    let indexDEC = balanceResponse.data.findIndex(x => x.token === "DEC");
    let indexECR = balanceResponse.data.findIndex(x => x.token === "ECR");

    let trsactionResponse;
    if (questResponse.data.length != 0 && questResponse.data[0].claim_trx_id != null) {
      trsactionResponse = await axios.get(`https://api.splinterlands.io/transactions/lookup?trx_id=${questResponse.data[0].claim_trx_id}`);
    }

    let ecr_cal = ((detailResponse.data.capture_rate / 100) + ((new Date() - new Date(balanceResponse.data[indexECR] == undefined ? 0 : balanceResponse.data[indexECR].last_reward_time)) / (1000 * 60 * 60) * 1.041)).toFixed(2);
    let data = {
      ...detailResponse.data,
      ...{
        dec: balanceResponse.data[indexDEC] == null ? 0 : balanceResponse.data[indexDEC].balance,
        // No: i + 1,
        ecr: balanceResponse.data[indexECR] == null ? 0 : balanceResponse.data[indexECR].balance,
        ecr_current: ecr_cal > 100 ? 100 : ecr_cal,
        last_reward_time: balanceResponse.data[indexDEC] == null ? 0 : balanceResponse.data[indexECR].last_reward_time
      },
      ...{

        questName: questResponse.data.length != 0 ? questResponse.data[0].name : null,
        questTotalItem: questResponse.data.length != 0 ? questResponse.data[0].total_items : 0,
        questCompleted: questResponse.data.length != 0 ? questResponse.data[0].completed_items : 0,
        questClaimTrxID: questResponse.data.length != 0 ? questResponse.data[0].claim_trx_id : null,
        questClaimDate: questResponse.data.length != 0 ? questResponse.data[0].claim_date : null,
        questRewards: questResponse.data.length != 0 ? questResponse.data[0].rewards : null,
      },
      ...{
        transactionInfo: trsactionResponse != undefined ? JSON.parse(trsactionResponse.data.trx_info.result).rewards : null
      }
    };

    var cloneAccounts = this.state.accounts;
    for (let index = 0; index < cloneAccounts.length; index++) {
      const element = cloneAccounts[index];
      if (element.name === accountName) {
        cloneAccounts[index].dec = data.dec;
        cloneAccounts[index].collection_power = data.collection_power;
        cloneAccounts[index].ecr = data.ecr;
        cloneAccounts[index].ecr_cal = data.ecr_cal;
        cloneAccounts[index].last_reward_time = data.last_reward_time;
        cloneAccounts[index].ecr_current = data.ecr_current;
        cloneAccounts[index].questName = data.questName;
        cloneAccounts[index].questTotalItem = data.questTotalItem;
        cloneAccounts[index].questCompleted = data.questCompleted;
        cloneAccounts[index].questClaimTrxID = data.questClaimTrxID;
        cloneAccounts[index].questClaimDate = data.questClaimDate;
        cloneAccounts[index].questRewards = data.questRewards;
        cloneAccounts[index].rating = data.rating;
      }
    }

    this.setState({ disabled: false, accounts: cloneAccounts });
  }

  toggleDetails(index) {
    const position = this.state.details.indexOf(index);
    let newDetails = this.state.details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...this.state.details, index];
    }

    this.setState({ details: newDetails });
  }

  timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  render() {
    return (
      <>
        <CRow>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header={this.state.accounts.length.toString()}
              text="Accounts"
              color="gradient-info"
              inverse
            >
              <CIcon name="cil-people" height="36" />
            </CWidgetProgressIcon>
          </CCol>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header={this.state.accounts.filter(item => item.collection_power < process.env.REACT_APP_CP_ALERT).length.toString()}
              text={'Collection Power < ' + process.env.REACT_APP_CP_ALERT + ' CP'}
              color="gradient-success"
              inverse
            >
              <CIcon name="cil-userFollow" height="36" />
            </CWidgetProgressIcon>
          </CCol>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header={this.state.accounts.filter(item => ((item.capture_rate / 100) + ((new Date() - new Date(item.last_reward_time)) / (1000 * 60 * 60) * 1.041)).toFixed(2) >= 90).length.toString()}
              text={'Enery Capture Rate >= ' + process.env.REACT_APP_ERC_HIGH + '% '}
              color="gradient-warning"
              inverse
            >
              <CIcon name="cil-basket" height="36" />
            </CWidgetProgressIcon>
          </CCol>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header={this.state.accounts.reduce((a, b) => +a + +b.dec, 0).toFixed(2).toString()}
              text="Dark Energy Crystals"
              color="gradient-primary"
              inverse
            >
              <CIcon name="cil-chartPie" height="36" />
            </CWidgetProgressIcon>
          </CCol>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header={this.state.accounts.sort((a, b) => b.dec - a.dec)[0] != undefined ? this.state.accounts.sort((a, b) => b.dec - a.dec)[0].name : 'Player'}
              text="Highest"
              color="gradient-danger"
              inverse
            >
              <CIcon name="cil-speedometer" height="36" />
            </CWidgetProgressIcon>
          </CCol>
          <CCol sm="6" md="2">
            <CWidgetProgressIcon
              header="Comming"
              text="to soon"
              color="gradient-info"
              inverse
            >
              <CIcon name="cil-speech" height="36" />
            </CWidgetProgressIcon>
          </CCol>
        </CRow>
        <ToastContainer />
        <CRow>
          <CCol xs="12" lg="12">
            <CCard>
              <CCardHeader>
                <strong>Splinterlands Accounts ({this.state.accounts.length})</strong>
                <div className="card-header-actions">
                  <CFormGroup row style={{ marginBottom: '0' }}>
                    <CCol md="12">
                      <CInputGroup>
                        <CInput id="input2-group2" name="input2-group2" placeholder="Coming to soon" />
                        <CInputGroupAppend>
                          <CButton type="button" color="primary">Add</CButton>
                        </CInputGroupAppend>
                      </CInputGroup>
                    </CCol>
                  </CFormGroup>
                </div>

              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={this.state.accounts}
                  fields={fields}
                  itemsPerPageSelect
                  itemsPerPage={10}
                  pagination
                  columnFilter
                  tableFilter
                  sorter
                  hover
                  scopedSlots={{
                    'name':
                      (item) => (
                        <td>
                          <strong>{item.name}</strong>
                          <CIcon content={freeSet.cilCopy} className="ml-2" onClick={() => { navigator.clipboard.writeText(item.PostingKey); toast.info("Copied") }} style={{ cursor: 'pointer' }} />
                        </td>
                      ),
                    'questClaimTrxID':
                      (item) => (
                        <td className="text-right">
                          {
                            item.questClaimTrxID == undefined
                              ? <div className="text-value text-danger">{item.questCompleted + '/' + item.questTotalItem}</div>
                              : <CButton color="success" onClick={() => { this.setInfo(!this.state.info); this.setState({ transactionInfo: item.transactionInfo, questClaimTrxID: item.questClaimTrxID }) }} className="mr-1">Rewards</CButton>
                          }
                        </td>
                      ),
                    'collection_power':
                      (item) => (
                        <td className="text-right">
                          {item.collection_power < process.env.REACT_APP_CP_ALERT ? <div className="text-value text-danger">{item.collection_power}</div> : <div className="text-value text-success">{item.collection_power}</div>}
                        </td>
                      ),
                    'rating':
                      (item) => (
                        <td className="text-right">
                          <strong>{item.rating}</strong>
                        </td>
                      ),
                    'ecr':
                      (item) => (
                        <td className="text-right">
                          {item.capture_rate < process.env.REACT_APP_ERC_ALERT * 100 ? <div className="text-value text-danger">{item.capture_rate / 100}%</div> : <div className="text-value text-success">{item.capture_rate / 100}%</div>}
                        </td>
                      ),
                    'ecr_current':
                      (item) => (
                        <td className="text-right">
                          <div className="text-value text-success">{item.ecr_current}%</div>
                        </td>
                      ),
                    'dec':
                      (item) => (
                        <td className="text-right">
                          <div className="text-value text-success">{item.dec}</div>
                        </td>
                      ),
                    'last_reward_time':
                      (item) => (
                        <td className="text-center">
                          <p>{this.timeSince(new Date(item.last_reward_time))}</p>
                        </td>
                      ),
                    'cards':
                      (item) => {
                        return (
                          <td className="py-2 text-center">
                            <CButton
                              // color={this.state.disabled ? "secondary" : "primary"}
                              // onClick={() => { this.reloadAccount(item.name) }}
                              color="info"
                            >
                              Cards
                            </CButton>
                          </td>
                        )
                      },
                    'refresh':
                      (item) => {
                        return (
                          <td className="py-2 text-center">
                            <CButton
                              disabled={this.state.disabled}
                              color={this.state.disabled ? "secondary" : "primary"}
                              onClick={() => { this.reloadAccount(item.name) }}
                            >
                              {this.state.disabled ? "Refresh" : "Refresh"}
                            </CButton>
                          </td>
                        )
                      }
                  }}
                />

                <CModal
                  show={this.state.info}
                  onClose={() => this.setInfo(!this.state.info)}
                  size="lg"
                // closeOnBackdrop={false}
                >
                  <CModalHeader closeButton>
                    {/* https://api.splinterlands.io/transactions/lookup?trx_id= */}
                    <CModalTitle>Reward information <a href={'https://api.splinterlands.io/transactions/lookup?trx_id=' + this.state.questClaimTrxID} target="_blank">{this.state.questClaimTrxID}</a></CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CRow className="justify-content-md-center" key={this.state.questClaimTrxID} xs={{ gutterY: 5 }} md={{ gutterY: 5 }}>
                      {this.rewardDetail(JSON.stringify(this.state.transactionInfo))}
                    </CRow>
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" onClick={() => this.setInfo(!this.state.info)}>Close</CButton>
                  </CModalFooter>
                </CModal>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     getCandidates: () => {
//       dispatch(getUsers());
//     },
//     getRecruiter: () => {
//       dispatch(getUsers());
//     },
//     getMatch: () => {
//       dispatch(getUsers());
//     }
//   };
// };

// const mapStateToProps = state => {
//   return {
//     user: state.dashboard.dashboard
//   };
// };

// const DashboardContainer = withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(Dashboard)
// );

export default Dashboard;
// export default DashboardContainer;