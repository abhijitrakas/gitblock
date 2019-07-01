/* globals gitblock_var */

import Card from './card.js';
import Autocomplete from 'react-autocomplete';

const { __ } = wp.i18n;
const { Component } = wp.element;
const Octokit = require( '@octokit/rest' );

const ghClient = new Octokit( {
	auth: 'token ' + gitblock_var.token,
} );

class Edit extends Component {
	constructor( props ) {
		super( props );

		const { userName, userFollowers, userRepos, userAvatar } = props.attributes;

		this.state = {
			value: userName ? userName : '',
			items: [],
			users: [],
			userFollowers: userFollowers ? userFollowers : '',
			userRepos: userRepos ? userRepos : '',
			userAvatar: userAvatar ? userAvatar : '',
		};

		this.onTextChange = this.onTextChange.bind( this );
		this.onSelect = this.onSelect.bind( this );
	}

	getUsers( query ) {
		if ( ! query ) {
			return;
		}
		ghClient.search.users( { q: query } ).then( data => {
			const result = data.data.items.map( function( user ) {
				return user.login;
			} );

			this.setState( { items: result ? result : [] } );
			this.setState( { users: data.data.items } );
		} );
	}

	populateUserInfo( user ) {
		ghClient.users.getByUsername( { username: user } ).then( data => {
			const userInfo = data.data;

			const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
			const d = new Date( userInfo.created_at );
			const dayName = d.getDate() + ' ' + days[ d.getDay() ] + ' ' + d.getFullYear();

			this.props.setAttributes( { userFollowers: userInfo.followers } );
			this.props.setAttributes( { userFollowing: userInfo.following } );
			this.props.setAttributes( { userName: userInfo.name } );
			this.props.setAttributes( { userLogin: userInfo.login } );
			this.props.setAttributes( { userRepos: userInfo.public_repos } );
			this.props.setAttributes( { userAvatar: userInfo.avatar_url } );
			this.props.setAttributes( { userURL: userInfo.html_url } );
			this.props.setAttributes( { userJoined: dayName } );
			this.props.setAttributes( { userCompany: userInfo.company } );
			this.props.setAttributes( { userBio: userInfo.bio } );
			this.props.setAttributes( { userLocation: userInfo.location } );
			this.setState( { value: user } );
		} );

		ghClient.request( 'GET https://api.github.com/users/' + user + '/orgs' ).then( data => {
			if ( data.data.length ) {
				this.props.setAttributes( {
					userOrgs: data.data.map( ( d ) => ( {
						login: d.login,
						avatar_url: d.avatar_url,
						html_url: 'https://github.com/' + d.login,
					} )
					) }
				);
			} else {
				this.props.setAttributes( { userOrgs: [] } );
			}
		} );
	}

	onTextChange( event ) {
		const userQuery = event.target.value;
		this.setState( { value: userQuery } );
		this.getUsers( userQuery );
	}

	onSelect( value ) {
		this.populateUserInfo( value );
	}

	render() {
		const attributes = this.props.attributes;

		if ( ! gitblock_var.token ) {
			return (
				<div className={ this.props.className }>
					Please Enter a valid Github
					<a href={ gitblock_var.settingsURL }>OAuth Token</a>
				</div>
			);
		}

		if ( attributes.userAvatar && gitblock_var.token ) {
			return (
				<div className={ this.props.className }>
					<Card
						userName={ attributes.userName }
						userLogin={ attributes.userLogin }
						userJoined={ attributes.userJoined }
						userAvatar={ attributes.userAvatar }
						userCompany={ attributes.userCompany }
						userURL={ attributes.userURL }
						userBio={ attributes.userBio }
						userLocation={ attributes.userLocation }
						userRepos={ attributes.userRepos }
						userFollowers={ attributes.userFollowers }
						userFollowing={ attributes.userFollowing }
						userOrgs={ attributes.userOrgs }
					/>
				</div>
			);
		}

		return (
			<Autocomplete
				items={ this.state.items }
				getItemValue={ ( item ) => item }
				renderItem={ ( item, isHighlighted ) =>
					<div style={ { background: isHighlighted ? 'grey' : 'white' } }>
						{ item }
					</div>
				}
				value={ this.state.value }
				onChange={ this.onTextChange }
				onSelect={ this.onSelect }
				menuStyle={ {
					zIndex: 999,
				} }
				inputProps={ { placeholder: __( 'Enter your Github Username' ),
					style: {
						width: '250px',
					},
				} }
			/>
		);
	}
}

export default Edit;
