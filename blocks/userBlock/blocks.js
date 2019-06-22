/* globals gitblock_var */

//  Import CSS.
import './style.scss';
import './editor.scss';
import { Card } from './card.js';
import Autocomplete from 'react-autocomplete';

const { Component } = wp.element;
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const Octokit = require( '@octokit/rest' );

const ghClient = new Octokit( {
	auth: 'token ' + gitblock_var.token,
} );

registerBlockType( 'gitblock/user', {
	title: __( 'gitblock - Display User Info' ),
	icon: 'businessman',
	category: 'common',
	keywords: [
		__( 'gitblock' ),
		__( 'user' ),
		__( 'Github' ),
	],
	attributes: {
		userName: {
			type: 'text',
		},
		userLogin: {
			type: 'text',
		},
		userFollowers: {
			type: 'text',
		},
		userRepos: {
			type: 'text',
		},
		userAvatar: {
			type: 'text',
		},
		userURL: {
			type: 'text',
		},
		userFollowing: {
			type: 'text',
		},
		userOrgs: {
			type: 'text',
		},
		userJoined: {
			type: 'text',
		},
		userCompany: {
			type: 'text',
		},
		userBio: {
			type: 'text',
		},
		userLocation: {
			type: 'text',
		},
	},

	edit: class extends Component {
		constructor( props ) {
			super( props );

			this.state = {
				value: this.props.attributes.userName ? this.props.attributes.userName : '',
				items: [],
				users: [],
				userFollowers: this.props.attributes.userFollowers ? this.props.attributes.userFollowers : '',
				userRepos: this.props.attributes.userRepos ? this.props.attributes.userRepos : '',
				userAvatar: this.props.attributes.userAvatar ? this.props.attributes.userAvatar : '',
			};

			this.onTextChange = this.onTextChange.bind( this );
			this.onSelect = this.onSelect.bind( this );
		}

		getUsers( query ) {
			if ( query ) {
				ghClient.search.users( { q: query } ).then( data => {
					const result = data.data.items.map( function( user ) {
						return user.login;
					} );

					this.setState( { items: result ? result : [] } );
					this.setState( { users: data.data.items } );
				}
				);
			}
		}

		populateUserInfo( user ) {
			let userInfo;
			ghClient.users.getByUsername( { username: user } ).then( data => {
				userInfo = data.data;

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
			const returnContent = [];
			const attributes = this.props.attributes;

			if ( this.props && gitblock_var.token ) {
				returnContent.push(
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

			if ( attributes.userAvatar && gitblock_var.token ) {
				returnContent.push(
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

			if ( ! gitblock_var.token ) {
				returnContent.push( <div className={ this.props.className }> Please Enter a valid Github <a href={ gitblock_var.settingsURL }>OAuth Token </a> </div> );
			}

			return returnContent;
		}
	},

	save: function( props ) {
		const { attributes } = props;

		return (
			<div className={ props.className }>
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
	},
} );
