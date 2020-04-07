import React, {Component} from 'react';
import './App.css';
import {Container, Dropdown, Header, Icon, Image, Loader, Menu, Segment, Table} from "semantic-ui-react";
import ninja from './ninja-dab.png';

const moment = require("moment")

class Leaderboard extends Component {
  constructor(props) {
    super(props)

    let start = moment().startOf("month")
    let end = moment().endOf("month")

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

    this.state = {
      data: {
        discourse: [],
        so: []
      },
      weeks: weeks
    }
  }

  componentDidMount() {
    fetch('https://ue81grqdr8.execute-api.us-east-1.amazonaws.com/dev/AllNinjas')
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data})
        console.log(data)
      })
      .catch(console.log)
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
        defaultValue="2020-04-01"
        options={monthOptions}
      />
      </span>

      {data.discourse.length > 0 && <Table basic='very' celled collapsing>
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
              <Table.Cell>
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
                    <div><Icon name="thumbs up outline"/><sup>{ninja.weekly[week]}</sup></div> :
                    ""
                  }
                </Table.Cell>
              })}
            </Table.Row>
          })}
        </Table.Body>
      </Table>}

      {data.discourse.length === 0 &&
        <div>
      <Loader active inline>
        Loading Ninjas
      </Loader>
        </div>
      }

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
  height: '100vh',
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
      <Menu.Item as='a'
                 style={defaultIconStyle}>
        <Icon size='big' name='home' color='gray'/>
      </Menu.Item>
      <Menu.Item title='Centralities' as='a'
                 style={menuItemStyle}>
        <Icon size='big' name='angle double right' color='gray'/>
      </Menu.Item>

    </div>
  </Menu>
}

class App extends Component {
  render() {
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
          <Image src={ninja} width="38px" height="38px" />

          </Segment>
          <div style={{display: "flex", padding: "1em 1em"}}>
          {page.view}
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
