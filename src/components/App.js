import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatatPopup";
import AddPlacePopup from "./AddPlacePopup";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditAvatarPopupOpen: false,
      isEditProfileOpen: false,
      isAddPlacePopupOpen: false,
      selectedCard: { name: "", link: "" },
      currentUser: { },
      cards: [ ]
    };
  }

  handleEditAvatarClick = () => {
    this.setState({ isEditAvatarPopupOpen: true });
  };

  handleEditProfileClick = () => {
    this.setState({ isEditProfileOpen: true });
  };

  handleAddPlaceClick = () => {
    this.setState({ isAddPlacePopupOpen: true });
  };

  handleCardClick = (cardElement) => {
    this.setState({ selectedCard: cardElement });
  };

  closeAllPopups = () => {
    this.setState({
      isEditAvatarPopupOpen: false,
      isEditProfileOpen: false,
      isAddPlacePopupOpen: false,
      selectedCard: { name: "", link: "" },
    });
  };

  componentDidMount() {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      this.setState({
        currentUser: userData,
        cards: cards
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  handleUpdateUser = (data) => {
    api.patchProfileData(data)
    .then(() => {
      this.setState({
        currentUser: this.state.currentUser
      })
      api.getUserInfo()
        .then((userData) => {
          this.setState({
            currentUser: userData,
          });
          this.closeAllPopups();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  handleUpdateAvatar = (data) => {
    api.patchProfileAvatar(data)
    .then(() => {
      api.getUserInfo()
      .then((userData) => {
        this.setState({
          currentUser: userData,
        });
        this.closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  handleCardLike = (card) => {
    const isLiked = card.likes.some(like => like._id === this.state.currentUser._id);

    api.toggleLike(card._id, isLiked)
    .then((newCard) => {
      this.setState({
        cards: this.state.cards.map(
          (stateElement) => stateElement._id === card._id ? newCard : stateElement
        )
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
      this.setState({
        cards: this.state.cards.filter((stateElement) => stateElement._id !== card._id)
      })
    })
    .catch((err) => {
      console.log(err);
    });
  };

  handleAddPlaceSubmit = (card) => {
    api.addNewCard(card)
    .then((newCard) => {
      this.setState({
        cards: [newCard, ...this.state.cards]
      });
      this.closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  };

  render() {
    return (
      <CurrentUserContext.Provider value={this.state.currentUser}>
        <Header />
        <Main
          onEditAvatar={this.handleEditAvatarClick}
          onEditProfile={this.handleEditProfileClick}
          onAddPlace={this.handleAddPlaceClick}
          onCardView={this.handleCardClick}
          cards={this.state.cards}
          onCardLike={this.handleCardLike}
          onCardDelete={this.handleCardDelete}
        />
        <Footer />
        <EditProfilePopup
          isOpen={this.state.isEditProfileOpen}
          onClose={this.closeAllPopups}
          onUpdateUser={this.handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={this.state.isAddPlacePopupOpen}
          onClose={this.closeAllPopups}
          onAddPlace={this.handleAddPlaceSubmit}
        />
        <PopupWithForm name="confirm" title="Вы уверены?" />
        <EditAvatarPopup
          isOpen={this.state.isEditAvatarPopupOpen}
          onClose={this.closeAllPopups}
          onUpdateAvatar={this.handleUpdateAvatar}
        />
        <ImagePopup
          onClose={this.closeAllPopups}
          card={this.state.selectedCard}
        />
      </CurrentUserContext.Provider>
    );
  };
};

export default App;
