import React, {Component} from 'react';
import './App.css';
import {Container, Dropdown, Header, Icon, Image, Loader, Menu, Segment, Table} from "semantic-ui-react";
import ninjaImage from './ninja-dab.png';
import { Router, Link } from "@reach/router";
import { navigate } from "@reach/router";
const moment = require("moment")

class Leaderboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        discourse: [],
        so: []
      },
      weeks: this.generateWeeks(props.month)
    }
  }

  generateWeeks(month) {
    const selectedMonth = moment(new Date(month));
    let start = selectedMonth.clone().startOf("month").startOf("week")
    let end = selectedMonth.clone().endOf("month")

    const weeks = [];
    let startDate = start.isoWeekday(7);
    if (startDate.date() === 8) {
      startDate = startDate.isoWeekday(-5)
    }

    while (startDate.isBefore(end)) {
      let startDateWeek = startDate.isoWeekday('Sunday').format('YYYY-MM-DD');
      startDate.add(7, 'days');
      weeks.push(startDateWeek);
    }
    return weeks;
  }

  componentDidMount() {
    this.getActivities(this.props.month);
  }

  getActivities(month) {
    this.setState({ data: {discourse: [], so: []}})
    fetch('https://ue81grqdr8.execute-api.us-east-1.amazonaws.com/dev/AllNinjas?date=' + month)
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data})
        console.log(data)
      })
      .catch(console.log)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps.month,this.props.month )
    if(prevProps.month !== this.props.month) {
      this.getActivities(this.props.month);
      this.setState( {
        weeks: this.generateWeeks(this.props.month)
      })
    }
  }

  render() {
    const {data, weeks} = this.state

    const monthOptions = [
      {key: '2020-04-01', value: '2020-04-01', text: 'April 2020'},
      {key: '2020-03-01', value: '2020-03-01', text: 'March 2020'},
    ]

    return <div>
      <span>
        Leaderboard for {' '}
      <Dropdown
        placeholder='Select month'
        inline
        defaultValue={this.props.month}
        options={monthOptions}
        onChange = {(event, data) => navigate("/leaderboard/" + data.value)}
      />
      </span>

      {<Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>

            {weeks.map(week => {
              return <Table.HeaderCell>{week}</Table.HeaderCell>
            })}

          </Table.Row>
        </Table.Header>

        <Table.Body>

          {data.discourse.map(ninja => {
            return <Table.Row>
              <Table.Cell key={ninja.user}>
                <Header as='h4' image>
                  <Header.Content>
                    {ninja.user}
                    <Header.Subheader>
                      {ninja.email}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              {weeks.map(week => {
                return <Table.Cell>
                  {Object.keys(ninja.weekly).includes(week) ?
                    <div>
                      <Image src={ninjaImage} width="20px" height="20px" style={{display: "inline"}} />
                      <sup>{ninja.weekly[week]}</sup>
                    </div> :
                    ""
                  }
                </Table.Cell>
              })}
            </Table.Row>
          })}


          {data.discourse.length === 0 &&
          <Table.Row>
            <Table.Cell colSpan={weeks.length+1} textAlign={"center"} >
            <Loader active inline centered>

                Loading Ninjas

            </Loader>
            </Table.Cell>
          </Table.Row>
          }

        </Table.Body>
      </Table>}



    </div>
  }
}
const menuItemStyle = {
  padding: '2em'
}

const defaultIconStyle = {
  padding: '2em 2em 3em 2em'
}

const menuStyle = {
  borderRadius: '0',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'space-between',
  width: '6em'
}

const topBarStyle = {
  height: '100%'
}

function SideMenu() {
  return <Menu vertical={true} inverted style={menuStyle}>
    <div style={topBarStyle}>
      <Menu.Item as='a' onClick={() => navigate("/")}
                 style={defaultIconStyle}>
        <Icon size='big' name='home' color='grey'/>
      </Menu.Item>
      <Menu.Item title='Centralities' as='a'
                 style={menuItemStyle}>
        <Icon size='big' name='angle double right' color='grey'/>
      </Menu.Item>

    </div>
  </Menu>
}

class App extends Component {
  render() {
    const currentMonth = moment().startOf("month")

    const HomeRoute = () => <Leaderboard month={currentMonth.format('YYYY-MM-DD')}/>;
    const LeaderboardRoute = props => <Leaderboard month={props.month} />;

    const page = {
      header: "Ninjas Leaderboard",
      view: <Leaderboard/>
    }

    return (
      <Container fluid style={{ display: 'flex' }}>
        <SideMenu />

        <div style={{width: '100%'}}>
          <Segment basic  vertical={false}
                   style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
            {page.header ? <Header as='h1' inverted color='grey' style={{marginTop: '0'}}>
              {page.header}
            </Header> : null}
          <Image src={ninjaImage} width="38px" height="38px" />

          </Segment>
          <div style={{display: "flex", padding: "1em 1em"}}>


            <Router>
              <HomeRoute path="/" />
              <LeaderboardRoute path="/leaderboard/:month" />
            </Router>
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
