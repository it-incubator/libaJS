const inlineCss = `
  <style type="text/css">
    .idAndUsername {
      display: flex;
      gap: 8px;
    }
    .userCard {
      background-color: darkgrey;
      border-radius: 8px;
      padding: 12px;
      width: 200px;
      margin-top: 24px;
    }
  </style>
`

const userCardTemplate = (userData) => `
  <div class="userCard">
    <div class="idAndUsername">
      <div>${userData.id}</div>
      <div>${userData.username}</div>  
    </div>
    <div>${userData.email}</div>
  </div>
`;


export function UserCard(props, {liba}) {
  const head = document.getElementsByTagName('head')[0];
  const styleElement = document.createElement("style");
  
  styleElement.innerHTML = inlineCss;
  head.append(styleElement);

  const element = document.createElement("div");

  return {
    element,
    props,
  }
}

UserCard.render = ({ element, props }) => {
  const {
    user,
  } = props;

  const userCardElement = document.createElement('div');
  userCardElement.innerHTML = userCardTemplate(user);

  element.append(userCardElement);
};
