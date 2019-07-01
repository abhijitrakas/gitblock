import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

class Card extends Component {
	constructor( props ) {
		super( props );
		this.props = props;
	}

	render() {
		const {
			userName,
			userLogin,
			userJoined,
			userAvatar,
			userCompany,
			userURL,
			userBio,
			userLocation,
			userRepos,
			userFollowers,
			userFollowing,
			userOrgs,
		} = this.props;
		return (
			<Fragment>
				<div className="gitcard">
					<div className="additional">
						<div className="user-card">
							<div className="login_top center">
								{ userLogin }
							</div>
							<div className="profile_link center">
								<a href={ userURL } target="_blank" rel="noopener noreferrer">{ __( 'Visit Profile' ) }</a>
							</div>
							<figure>
								<img alt={ __( 'User Avatar' ) } src={ userAvatar } />
							</figure>
						</div>
						<div className="more-info">
							<h4>{ userName }</h4>
							<div className="coords">
								{ userOrgs.length > 0 &&
									<h6>{ __( 'User Organisations' ) }</h6>
								}
								{ userOrgs.length > 0 &&
								<div className="orgContainer" title={ __( 'Scroll to view all organisations if not visible.' ) }>
									{
										userOrgs.map( ( userOrg ) => (
											<a key={ userOrg.login } href={ userOrg.html_url } target="_blank" rel="noopener noreferrer">
												<img key={ userOrg.login } src={ userOrg.avatar_url } alt={ userOrg.login + '\'s Avatar' } />
											</a>
										) )
									}
								</div>
								}
							</div>
							<div className="stats">
								<div>
									<div className="title">{ __( 'Repositories' ) }</div>
									<a href={ 'https://github.com/' + userLogin + '?tab=repositories' } className="profile_links" target="_blank" rel="noopener noreferrer">
										<FontAwesomeIcon icon={ faGithubAlt } />
										<div className="value">{ userRepos }</div>
									</a>
								</div>
								<div>
									<div className="title">{ __( 'Followers' ) }</div>
									<a href={ 'https://github.com/' + userLogin + '?tab=followers' } className="profile_links" target="_blank" rel="noopener noreferrer">
										<FontAwesomeIcon icon={ faUsers } />
										<div className="value">{ userFollowers }</div>
									</a>
								</div>
								<div>
									<div className="title">{ __( 'Following' ) }</div>
									<a href={ 'https://github.com/' + userLogin + '?tab=following' } className="profile_links" target="_blank" rel="noopener noreferrer">
										<FontAwesomeIcon icon={ faUserFriends } />
										<div className="value">{ userFollowing }</div>
									</a>
								</div>

							</div>
						</div>
					</div>
					<div className="general">
						<h4>{ userName }</h4>
						<span>{ userJoined && `Joined: ${ userJoined }` }</span>
						<br />
						<span>{ userCompany && `Company: ${ userCompany }` }</span>
						<br />
						<span>{ userBio && `Bio: ${ userBio }` }</span>
						<br />
						<span>{ userLocation && `Location: ${ userLocation }` }</span>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Card;
