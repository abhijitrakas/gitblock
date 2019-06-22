/* globals gitblock_var */

//  Import CSS.
import './style.scss';
import './editor.scss';
import { TextControl, Button } from '@wordpress/components';
import { Card } from './card.js';

const { Component } = wp.element;
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const Octokit = require( '@octokit/rest' );

const ghClient = new Octokit( {
	auth: 'token ' + gitblock_var.token,
} );

registerBlockType( 'gitblock/org-members', {
	title: __( 'gitblock - Display Organisations Members' ),
	icon: 'groups',
	category: 'common',
	keywords: [
		__( 'gitblock' ),
		__( 'org' ),
		__( 'Github' ),
	],
	attributes: {
		orgName: {
			type: 'text',
		},
		orgMembers: {
			type: 'text',
		},
		orgRepos: {
			type: 'text',
		},
		orgAvatar: {
			type: 'text',
		},
		orgURL: {
			type: 'text',
		},
		orgLogin: {
			type: 'text',
		},
		orgCreated: {
			type: 'text',
		},
		orgLocation: {
			type: 'text',
		},
	},

	edit: class extends Component {
		constructor( props ) {
			super( props );

			this.state = {
				value: this.props.attributes.orgName ? this.props.attributes.orgName : '',
				orgMembers: this.props.attributes.orgMembers ? this.props.attributes.orgMembers : '',
			};

			this.onChange = this.onChange.bind( this );
			this.getOrgInfo = this.getOrgInfo.bind( this );
		}

		populateOrgInfo( org ) {
			ghClient.request( 'GET https://api.github.com/orgs/' + org ).then( data => {
				if ( data.data ) {
					const orgInfo = data.data;

					const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
					const d = new Date( orgInfo.created_at );
					const dayName = d.getDate() + ' ' + days[ d.getDay() ] + ' ' + d.getFullYear();

					this.props.setAttributes( { orgName: org } );
					this.props.setAttributes( { orgRepos: orgInfo.public_repos } );
					this.props.setAttributes( { orgAvatar: orgInfo.avatar_url } );
					this.props.setAttributes( { orgURL: orgInfo.html_url } );
					this.props.setAttributes( { orgLogin: orgInfo.login } );
					this.props.setAttributes( { orgCreated: dayName } );
					this.props.setAttributes( { orgLocation: orgInfo.location } );

					ghClient.request( 'GET https://api.github.com/orgs/' + org + '/public_members' ).then( orgdata => {
						if ( orgdata.data.length ) {
							this.props.setAttributes( {
								orgMembers: orgdata.data.map( ( d ) => ( {
									login: d.login,
									avatar_url: d.avatar_url,
									html_url: 'https://github.com/' + d.login,
								} ),
								),
							},
							);
						} else {
							this.props.setAttributes( { userOrgs: [] } );
						}
					} );
				}
			} );
		}

		getOrgInfo() {
			this.populateOrgInfo( this.state.value );
		}

		onChange( value ) {
			this.setState( { value: value } );
		}

		render() {
			const returnContent = [];
			const attributes = this.props.attributes;

			if ( this.props && gitblock_var.token ) {
				returnContent.push(
					<TextControl
						label="Enter Organisation Name"
						value={ this.state.value }
						onChange={ this.onChange }
					/>
				);
				returnContent.push(
					<Button isDefault onClick={ this.getOrgInfo }>Submit</Button>
				);
			}

			if ( attributes.orgName && attributes.orgURL && attributes.orgAvatar && attributes.orgMembers && gitblock_var.token ) {
				returnContent.push(
					<div className={ this.props.className }>
						<Card
							orgAvatar={ attributes.orgAvatar }
							orgRepos={ attributes.orgRepos }
							orgURL={ attributes.orgURL }
							orgMembers={ attributes.orgMembers }
							orgLogin={ attributes.orgLogin }
							orgCreated={ attributes.orgCreated }
							orgLocation={ attributes.orgLocation }
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
					orgAvatar={ attributes.orgAvatar }
					orgRepos={ attributes.orgRepos }
					orgURL={ attributes.orgURL }
					orgMembers={ attributes.orgMembers }
					orgLogin={ attributes.orgLogin }
					orgCreated={ attributes.orgCreated }
					orgLocation={ attributes.orgLocation }
				/>
			</div>
		);
	},
} );
