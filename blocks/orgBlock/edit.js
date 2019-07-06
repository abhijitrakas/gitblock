/* globals gitblock_var */

const { Component, Fragment } = wp.element;
const { TextControl, Button, Toolbar } = wp.components;
const { ServerSideRender, BlockControls } = wp.editor;
const { __ } = wp.i18n;

class edit extends Component {
	render() {
		const {
			attributes: {
				orgName,
				orgSelected,
			},
			setAttributes,
		} = this.props;

		const layoutControls = [
			{
				icon: 'edit',
				title: __( 'Update Organisation' ),
				onClick: () => setAttributes( { orgSelected: null } ),
				isActive: null !== orgSelected,
			},
		];

		if ( ! gitblock_var.token ) {
			return (
				<div className={ this.props.className }>
					{ __( 'Please Enter a valid Github' ) }
					<a href={ gitblock_var.settingsURL }>{ __( 'OAuth Token' ) } </a>
				</div>
			);
		}

		return (
			<Fragment>
				<BlockControls>
					<Toolbar controls={ layoutControls }></Toolbar>
				</BlockControls>
				{ ( gitblock_var.token && ! orgSelected ) ?
					(
						<Fragment>
							<TextControl
								label={ __( 'Enter Organisation Name' ) }
								value={ orgName }
								onChange={ val => setAttributes( { orgName: val } ) }
							/>
							<Button isDefault onClick={ () => setAttributes( { orgSelected: orgName } ) }>
								{ __( 'Submit' ) }
							</Button>
						</Fragment>
					) :
					(
						<ServerSideRender
							block="gitblock/org-members" attributes={ this.props.attributes }
						/>
					)
				}
			</Fragment>
		);
	}
}

export default edit;
