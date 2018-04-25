import { __ } from "@wordpress/i18n";
import { Component } from "@wordpress/element";
import { IconButton } from "@wordpress/components";
import apiRequest from "@wordpress/apiRequest";

class DocList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      query: "",
      docs: [],
      ready: false,
      loading: false
    };
    this.search = this.search.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }

  componoentDidMount() {
    this.search();
  }

  updateQuery(event) {
    this.setState({ query: event.target.value });
  }

  search() {
    this.setState({ loading: true });
    apiRequest({
      path:
        "/keyring/v1/proxy?service=google&url=https://www.googleapis.com/drive/v3/files"
    })
      .then(response => {
        this.setState({
          loading: false,
          ready: true,
          docs: response
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { ready, loading, docs, query } = this.state;

    if (loading && !ready) {
      return null;
    }

    if (!loading && !ready) {
      return (
        <IconButton icon="unlock" isPrimary onClick={this.login}>
          {__("Google Login", "dropit")}
        </IconButton>
      );
    }

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
        {docs.map(doc => <div key={doc.id}>{JSON.stringify(doc)}</div>)}
      </div>
    );
  }
}

export default DocList;
