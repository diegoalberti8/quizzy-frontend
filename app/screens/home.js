import React, { PropTypes } from 'react';
import { Row, Col, Grid } from 'react-bootstrap';
import MatchRow from '../components/match';
import { connect } from 'react-redux';
import { loadCurrentMatch, matchNameError, removeCurrentMatch, removeMatch } from '../redux/actions/match';
import { fetchMatches } from '../redux/actions/matches';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { EMPTY_MATCH_NAME } from '../constants/home';
import { Icon } from 'react-fa'
import scrollToElement from 'scroll-to-element';
import Reveal from 'react-reveal';
import 'animate.css/animate.css';
import { SlideFadeTop } from '../components/transitions';
import { TransitionGroup } from 'react-transition-group';
import '../stylesheets/home.scss';
import Spinner from '../components/spinner';
import '../stylesheets/react-spinner.scss';

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.checkEmptyName;
    this.isMouseOn = false;
    this.handleChange = this.handleChange.bind(this);
    this.checkEmptyName = this.checkEmptyName.bind(this);
    this.moveTable = this.moveTable.bind(this);
    this.renderMatches = this.renderMatches.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillMount() {
    this.props.removeCurrentMatch();
    this.props.removeMatch();
    this.props.fetchMatches();
  }

  componentDidMount() {
	if (this.props.matchesData.matches) {
		this.moveTable();
	};
  }

  handleChange(event) {
    this.props.loadCurrentMatch(event.target.value);
  }

  checkEmptyName(event) {
    if (!this.props.matchData.currentMatch.trim()) {
      event.preventDefault();
      this.props.matchNameError(EMPTY_MATCH_NAME);
    }
  }

  animateScroll(id) {
    scrollToElement(`#${ id }`, {
      offset: 0,
      ease: 'inOutExpo',
      duration: 1500
    });
  }

  moveTable() {
      setInterval(() => {
        if(!this.isMouseOn) {
          const { matchesData } = this.props;
          let length = matchesData.matches.length;
          let last = matchesData.matches[length - 1];
          matchesData.matches.pop();
          matchesData.matches.unshift(last);
          if(this.refs.root) {
            this.setState((state) => {
              { matches: matchesData.matches }
            });
          }
        }
      }, 4000);
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      if (!this.props.matchData.currentMatch.trim()) {
        target.preventDefault();
        this.props.matchNameError(EMPTY_MATCH_NAME);
      } else {
        this.props.history.push(`/match/${ this.props.matchData.currentMatch.toLowerCase() }`);
      }
    }
  }

  handleMouseOver() {
    this.isMouseOn = true;
  }

  handleMouseLeave() {
    this.isMouseOn = false;
  }

  renderTable() {
    const { matchesData } = this.props;
    if (matchesData.isFetching) {
      return (
        <div className='loading-matches'>
          <Spinner />
        </div>
      );
    } else if (matchesData.error) {
      return (
        <div>
          Could not get the matches from the server :(
        </div>
      );
    } else if (matchesData.matches) {
      return (
        <table onMouseOver={ this.handleMouseOver } onMouseLeave={ this.handleMouseLeave } ref='root' id='list' className='table'>
          { this.renderMatches() }
        </table>
      );
    }
    return (<div></div>);
  }

  renderMatches() {
    const items = [];
    this.props.matchesData.matches.forEach((match, index) => {
      if (index < 5) {
        items.push(
          <SlideFadeTop key={ match.url }>
            <MatchRow key={ index } data={ match }/>
          </SlideFadeTop>
        );
      }
    });
    return (<TransitionGroup component='tbody'>{ items }</TransitionGroup>);
  }

  render() {
    return (
      <div id='page-top'>
        <header className='intro'>
          <div className='intro-body'>
            <Row>
              <Col md={ 7 } mdOffset={ 2 } xs={ 12 }>
                <Reveal effect='animated slideInDown'>
                  <h2 className='brand-heading'>Create a game and start playing!</h2>
                </Reveal>
              </Col>
            </Row>
            <Row>
              <Col md={ 7 } mdOffset={ 2 } xs={ 12 }>
                <div className='match-container'>
                  <Reveal effect='animated slideInLeft'>
                    <div className='form-container'>
                      <div className='form-input horizontal long'>
                        <label className='fs-22'>quizzy.com/</label>
                        <input className='fs-16' type='text'
                               name='game' placeholder='Game name' onKeyPress={ this.handleKeyPress } onChange={ this.handleChange }/>
                        <Link to={ `/match/${ this.props.matchData.currentMatch.toLowerCase() }` }
                              onClick={ this.checkEmptyName } className='play-link'>
                          <button className='button primary medium'>PLAY!</button>
                        </Link>
                      </div>
                      <div className='form-input horizontal medium'>
                        <span className='error-message'> { this.props.matchData.error ? this.props.matchData.error : null } </span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={ 7 } mdOffset={ 2 } xs={ 12 }>
                <Reveal effect='animated slideInUp'>
                  <a href='#matches' onClick={ () => this.animateScroll('matches') } className='btn btn-circle page-scroll'>
                    <Icon name='angle-double-down' className='animated'></Icon>
                  </a>
                  <h2 className='arrow-title'>Or join a live one!</h2>
                </Reveal>
              </Col>
            </Row>
          </div>
        </header>
        <div id='matches' className='container content-section text-center'>
          <Row>
            <Col md={ 12 } xs={ 12 }>
              <h1 className='brand-heading'>Live games</h1>
            </Col>
          </Row>
          <Row>
            <Col md={ 12 } xs={ 12 }>
              <Reveal effect='animated bounceInLeft'>
                { this.renderTable() }
              </Reveal>
            </Col>
          </Row>
        </div>
        <div id='about' className='content-section text-center'>
          <div className='about-section'>
            <Row>
              <Col md={ 12 } xs={ 12 }>
                <h1 className='brand-heading'>How it works</h1>
              </Col>
            </Row>
            <Row>
              <Col md={ 12 } xs={ 12 }>
                <Reveal effect='animated fadeIn'>
                  <h5>Choose a game, answer the questions and prove your knowledge.
                    There are two modes you can play: normal & real-time.</h5>
                </Reveal>
              </Col>
            </Row>
            <Row>
              <Col md={ 12 } xs={ 12 }>
                <div className='modes-container'>
                  <Reveal effect='animated slideInLeft'>
                    <div className='game-mode'>
                      <h3>Normal</h3>
                      Start the match whenever you want and answer the questions while the time is running.
                    </div>
                  </Reveal>
                  <Reveal effect='animated slideInRight'>
                    <div className='game-mode'>
                      <h3>Real-Time</h3>
                      Compete at the same time with others players. Be the first to answer the questions!
                    </div>
                  </Reveal>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  matchData: PropTypes.object,
  matchesData: PropTypes.object,
  loadCurrentMatch: PropTypes.func,
  fetchMatches: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    matchData: state.matchData,
    matchesData: state.matchesData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadCurrentMatch: (input) => dispatch(loadCurrentMatch(input)),
    removeCurrentMatch: (input) => dispatch(removeCurrentMatch()),
    removeMatch: (input) => dispatch(removeMatch()),
    fetchMatches: () => dispatch(fetchMatches()),
    matchNameError: (msg) => dispatch(matchNameError(msg))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
