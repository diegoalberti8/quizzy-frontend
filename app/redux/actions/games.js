import gameService from '../../services/game'
import {
  LOAD_GAMES,
  LOAD_GAMES_SUCCESS,
  LOAD_GAMES_FAILURE,
} from '../constants/games';

export const loadGames = () => {
  return {
    type: LOAD_GAMES,
  }
}

export const loadGamesSuccess = games => {
  return {
    type: LOAD_GAMES_SUCCESS,
    games,
  }
};

export const loadGamesFailure = () => {
  return {
    type: LOAD_GAMES_FAILURE,
  }
};

export const fetchGames = () => {
  return (dispatch) => {
    // debugger;
    dispatch(loadGames());
    gameService.retrieve()
      .then((res) => {
        console.log(res);
        dispatch(loadGamesSuccess(res.data.games))
      })
      .catch((err) => {
        console.log(err);
        dispatch(loadGamesFailure())
      });
  }
};
