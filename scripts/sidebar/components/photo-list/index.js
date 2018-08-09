import { Component, createElement } from "@wordpress/element";
import { IconButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import "./style.scss";
import Photo from "../photo";

class PhotoList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      photos: [],
      query: ""
    };
    this.updateQuery = this.updateQuery.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.props.api.all().then(photos => {
      this.setState({ photos });
    });
  }

  updateQuery(event) {
    this.setState({ query: event.target.value });
  }

  search(event) {
    event.preventDefault();
    this.props.api.search(this.state.query).then(photos => {
      this.setState({ photos });
    });
  }

  render() {
    const { photos, query } = this.state;
    const { api } = this.props;
    return (
      <div>
        <form
          className="dropit-sidebar-photo-list__search-form"
          onSubmit={this.search}
        >
          <input
            type="text"
            value={query}
            onChange={this.updateQuery}
            placeholder={__("Search…", "dropit")}
          />
          <IconButton className="button" type="submit" icon="search" />
        </form>
        {photos.map(photo => (
          <Photo
            key={photo.id}
            photo={photo}
            api={{ download: api.download }}
          />
        ))}
      </div>
    );
  }
}

export default PhotoList;
