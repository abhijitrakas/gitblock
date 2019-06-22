import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';

const { Component } = wp.element;

export class Card extends Component {
	constructor( props ) {
		super( props );
		this.props = props;
	}

	render() {
		const {
			orgAvatar,
			orgRepos,
			orgURL,
			orgMembers,
			orgLogin,
			orgCreated,
			orgLocation,
		} = this.props;
		return (
			<React.Fragment>
				<div className="gitcard">
					<div className="additional">
						<div className="user-card">
							<div className="login_top center">
								{ orgLogin }
							</div>
							<div className="profile_link center">
								<a href={ orgURL } target="_blank" rel="noopener noreferrer">Visit Profile</a>
							</div>
							<img alt="Org Avatar" src={ orgAvatar } />
						</div>
						<div className="more-info">
							<h4>{ orgLogin }</h4>
							<div className="coords">
								{ orgMembers.length > 0 &&
									<h6>Public Members</h6>
								}
								{ orgMembers.length > 0 &&
								<div className="orgContainer" title="Scroll to view all members if not visible.">
									{
										orgMembers.map( ( orgMember ) => (
											<a key={ orgMember.login } href={ orgMember.html_url } target="_blank" rel="noopener noreferrer">
												<img key={ orgMember.login } src={ orgMember.avatar_url } alt={ orgMember.login + '\'s Avatar' } />
											</a>
										) )
									}
								</div>
								}
							</div>
							<div className="stats">
								<div>
									<div className="title">Repositories</div>
									<FontAwesomeIcon icon={ faGithubAlt } />
									<div className="value">{ orgRepos }</div>
								</div>
							</div>
						</div>
					</div>
					<div className="general">
						<h4>{ orgLogin }</h4>
						<span>{ orgCreated && `Created on: ${ orgCreated }` }</span>
						<br />
						<span>{ orgLocation && `Location: ${ orgLocation }` }</span>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
