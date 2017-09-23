import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';

class Game extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr>
        <td> <img src={ this.props.data.game.image } height="80" /> </td>
        <td> { this.props.data.game.name } </td>
        <td> Rating: { this.props.data.game.rating } </td>
        <td> <Link to={'/start-match'}><img className='play-button' src={ require('../../assets/images/play_button.png') }/></Link> </td>
      </tr>
    )
  }
}

export default Game;
