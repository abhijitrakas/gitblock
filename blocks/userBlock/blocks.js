//  Import CSS.
import './style.scss';
import './editor.scss';
import Card from './card.js';
import edit from './edit.js';
import attributesV100 from './v1.0.0/attributes';
import editV100 from './v1.0.0/edit';
import saveV100 from './v1.0.0/save';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

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
			type: 'string',
			source: 'text',
			selector: 'h4',
		},
		userLogin: {
			type: 'string',
			source: 'text',
			selector: 'div',
		},
		userFollowers: {
			type: 'string',
			source: 'text',
			selector: 'div',
		},
		userRepos: {
			type: 'string',
			source: 'text',
			selector: 'div',
		},
		userAvatar: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		userURL: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
		},
		userFollowing: {
			type: 'string',
			source: 'text',
			selector: 'div',
		},
		userOrgs: {
			type: 'array',
		},
		userJoined: {
			type: 'string',
			source: 'text',
			selector: 'span',
		},
		userCompany: {
			type: 'string',
			source: 'text',
			selector: 'span',
		},
		userBio: {
			type: 'string',
			source: 'text',
			selector: 'span',
		},
		userLocation: {
			type: 'string',
			source: 'text',
			selector: 'span',
		},
	},

	edit,

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

	deprecated: [
		// Version 1.0.0 deprecation.
		{
			attributes: attributesV100,
			edit: editV100,
			save: saveV100,
		},
	],
} );
