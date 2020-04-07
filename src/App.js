import React, {Component} from 'react';
import './App.css';
import {Container, Header, Icon, Image, Menu, Segment} from "semantic-ui-react";
import ninjaImage from './ninja-dab.png';
import {navigate, Router} from "@reach/router";
import {Leaderboard} from "./Leaderboard";

const moment = require("moment")

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
      {/*<Menu.Item title='Centralities' as='a'*/}
                 {/*style={menuItemStyle}>*/}
        {/*<Icon size='big' name='angle double right' color='grey'/>*/}
      {/*</Menu.Item>*/}

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
