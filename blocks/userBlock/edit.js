/* globals gitblock_var */

import Autocomplete from 'react-autocomplete';
import Octokit from '@octokit/rest';

const { ServerSideRender, BlockControls } = wp.editor;
const { Component, Fragment } = wp.element;
const { Toolbar } = wp.components;
const { __ } = wp.i18n;

const ghClient = new Octokit( {
	auth: 'token ' + gitblock_var.token,
} );

class edit extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			users: [],
		};

		this.setUserName = this.setUserName.bind( this );
		this.onSelectGitUser = this.onSelectGitUser.bind( this );
	}

	setUserName( event ) {
		const gitUserName = event.target.value;
		this.props.setAttributes( { userName: gitUserName } );

		if ( gitUserName.length < 3 ) {
			return;
		}

		ghClient.search.users( { q: gitUserName } ).then(
			data => {
				const result = data.data.items.map( function( user ) {
					return user.login;
				} );
				this.setState( { users: result ? result : [] } );
			}
		);
	}

	onSelectGitUser( gitUserName ) {
		this.props.setAttributes( { userName: gitUserName } );
		this.props.setAttributes( { userSelected: gitUserName } );
	}

	render() {
		const {
			attributes: {
				userName,
				userSelected,
			},
			className,
			setAttributes,
		} = this.props;

		const layoutControls = [
			{
				icon: 'edit',
				title: __( 'Change Github User' ),
				onClick: () => setAttributes( { userSelected: null } ),
				isActive: null !== userSelected,
			},
		];

		return (
			<Fragment>
				<BlockControls>
					<Toolbar controls={ layoutControls }></Toolbar>
				</BlockControls>
				{ ( ! userSelected ) ?
					<Autocomplete
						items={ this.state.users }
						getItemValue={ ( item ) => item }
						renderItem={ ( item, isHighlighted ) =>
							<div style={ { background: isHighlighted ? 'grey' : 'white' } }>
								{ item }
							</div>
						}
						value={ userName }
						onChange={ this.setUserName }
						onSelect={ this.onSelectGitUser }
						menuStyle={ {
							zIndex: 999,
						} }
						className={ className }
						inputProps={ { placeholder: __( 'Enter Github Username' ),
							style: {
								width: '250px',
							},
						} }
					/> :
					<ServerSideRender
						block="gitblock/user" attributes={ this.props.attributes }
					/>
				}
			</Fragment>
		);
	}
}

export default edit;
