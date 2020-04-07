import React, {Component} from 'react';
import './App.css';
import {Container, Header, Icon, List, Loader, Table} from "semantic-ui-react";
const moment = require("moment")

class App extends Component {
  constructor(props) {
    super(props)

    let start = moment().startOf("month")
    let end = moment().endOf("month")

    const weeks = [];
    let startDate = start.isoWeekday(7);
    if(startDate.date() === 8) {
      startDate = startDate.isoWeekday(-5)
    }

    while(startDate.isBefore(end)) {
      let startDateWeek = startDate.isoWeekday('Sunday').format('YYYY-MM-DD');
      startDate.add(7,'days');
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

    return (
      <div className="App" style={{padding: "5px"}}>
        <Header as="h1">
          Ninjas Leaderboard
        </Header>

        <Container textAlign={"left"} fluid>
          {data.discourse.length > 0  && <Table basic='very' celled collapsing>
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
                  {weeks.map(week =>{
                    return <Table.Cell>
                      {Object.keys(ninja.weekly).includes(week) ?
                        <div><Icon name="thumbs up outline" /><sup>{ninja.weekly[week]}</sup></div> :
                        ""
                      }
                    </Table.Cell>
                  })}

              </Table.Row>

            })}



            </Table.Body>
          </Table>}


          {data.discourse.length === 0 &&
            <Loader active inline='centered'>
              Loading Ninjas
            </Loader>
          }

        </Container>

      </div>
    );
  }
}

export default App;
