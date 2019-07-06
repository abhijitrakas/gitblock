//  Import CSS.
import './style.scss';
import './editor.scss';
import edit from './edit';

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
			default: null,
		},
		userSelected: {
			type: 'string',
			default: null,
		},
	},

	edit,

	save: () => {
		return null;
	},
} );
