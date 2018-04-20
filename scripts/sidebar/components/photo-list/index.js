import { Component } from "@wordpress/element";
import { IconButton } from "@wordpress/components";

import "./style.scss";
import Photo from "../photo";
import { getPhotos, searchPhotos } from "../../api";

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
    getPhotos().then(photos => {
      this.setState({ photos });
    });
  }

  updateQuery(event) {
    this.setState({ query: event.target.value });
  }

  search(event) {
    event.preventDefault();
    searchPhotos(this.state.query).then(data => {
      this.setState({ photos: data.results });
    });
  }

  render() {
    const { photos, query } = this.state;
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
            placeholder="Search…"
          />
          <IconButton className="button" type="submit" icon="search" />
        </form>
        {photos.map(photo => <Photo key={photo.id} photo={photo} />)}
      </div>
    );
  }
}

export default PhotoList;
