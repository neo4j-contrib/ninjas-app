import React, {Component} from 'react';
import './App.css';
import {Dropdown, Header, Icon, Image, Loader, Table} from "semantic-ui-react";
import ninjaImage from './ninja-dab.png';
import {navigate} from "@reach/router";

import Moment from 'moment'

export class Leaderboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        discourse: [],
        so: []
      },
      weeks: []
    }
  }

  componentDidMount() {
    this.getActivities(this.props.month);
  }

  getActivities(month) {
    this.setState({data: {discourse: [], so: []}})
    fetch('https://li1bjw7vv9.execute-api.us-east-1.amazonaws.com/dev/AllNinjas?date=' + month)
      .then(res => res.json())
      .then((data) => {
        this.setState({data: data, weeks: data.weeks})
        console.log(data)
      })
      .catch(console.log)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevProps.month, this.props.month)
    if (prevProps.month !== this.props.month) {
      this.getActivities(this.props.month);
      this.setState({
        weeks: []
      })
    }
  }

  render() {
    const {data, weeks} = this.state

    console.log("props", this.props)
    const {prefix} = this.props

    const dateStart = Moment(new Date(2020, 0,1))
    const dateEnd = Moment().startOf("month")
    const monthOptions = [];

    while (dateEnd >= dateStart || dateStart.format('M') === dateEnd.format('M')) {
      monthOptions.push({key: dateStart.format('YYYY-MM-DD'), value: dateStart.format('YYYY-MM-DD'), text: dateStart.format('MMM YYYY')});
      dateStart.add(1,'month');
    }

    let {discourse} = data
    if(this.props.prefix === "leaderboard") {
      discourse = discourse.filter(ninja => ninja.isNinja)
    }


    return <div>
      <span>
        Leaderboard for {' '}
        <Dropdown
          placeholder='Select month'
          inline
          defaultValue={this.props.month}
          options={monthOptions}
          onChange={(event, data) => navigate(`/${prefix}/${data.value}`)}
        />
      </span>

      {<Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>

            {weeks.map(week => {
              return <Table.HeaderCell textAlign={"center"}>{week.start}<br /><sub>{week.end}</sub></Table.HeaderCell>
            })}

          </Table.Row>
        </Table.Header>

        <Table.Body>

          {discourse.map(ninja => {
            return <Table.Row>
              <Table.Cell key={ninja.user}>
                <Header as='h4' image>
                  <Header.Content>
                    {ninja.discourseUser}
                    <Header.Subheader>
                      <a href={"https://community.neo4j.com/u/" + ninja.user + "/summary"} target="_blank">{ninja.user}</a>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              {weeks.map(week => {
                return <Table.Cell textAlign={"center"}>
                  {Object.keys(ninja.weekly).includes(week.start) ?
                    <div>
                      { ninja.isNinja ?
                        <Image src={ninjaImage} width="20px" height="20px" style={{display: "inline"}}/> :
                        <Icon name="thumbs up outline" />
                      }
                      <sup>{ninja.weekly[week.start]}</sup>
                    </div> :
                    ""
                  }
                </Table.Cell>
              })}
            </Table.Row>
          })}


          {data.discourse.length === 0 &&
          <Table.Row>
            <Table.Cell colSpan={weeks.length + 1} textAlign={"center"}>
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
