// Import CSS.
import './style.scss';
import './editor.scss';
import edit from './edit';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

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
			type: 'string',
			default: null,
		},
		orgSelected: {
			type: 'string',
			default: null,
		},
	},

	edit,

	save: () => {
		return null;
	},
} );
