import React from 'react';
import axios from 'axios';

class Jokes extends React.Component {
    state = {
        jokes: [],
    }

    render(){
        console.log(this.state.jokes)
        return(
            <div>
                <h2>List of Dad Jokes</h2>
                <div>
                {this.state.jokes.map(joke => 
                        (<p>{joke.joke} </p>)
                )}
                </div>
            </div>
        )
    }

    componentDidMount(){
        const token = localStorage.getItem('jwt');
        console.log(token)
        const endpoint = 'http://localhost:3300/api/jokes';
        const options = {
            headers: {
                Authorization: token
            }
        };

        axios.get(endpoint, options)
        .then(res => {
            console.log('data from /api/jokes', res.data );
            this.setState({ jokes: res.data })
        })
        .catch(err => {
            console.log('error from /api/jokes', err);
        })
    }
}

export default Jokes