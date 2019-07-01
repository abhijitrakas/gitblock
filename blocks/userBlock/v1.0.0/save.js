import Card from './../card.js';

const savev100 = props => {
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
};

export default savev100;
