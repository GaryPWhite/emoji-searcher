import React from 'react';
import LazyLoad from 'react-lazyload';
import './App.css';
import { Markup } from 'interweave';
import buildkitemojiraw from './buildkitemoji.json';
import * as JsSearch from 'js-search';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup } from 'react-bootstrap';
import { FaCopy, FaSearch, FaCheckCircle } from 'react-icons/fa';
import CopyToClipboard from 'react-copy-to-clipboard'

// configure search for buildkiteemojiraw
const search = new JsSearch.Search('emojiName');
search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
search.addIndex('emojiName');
search.addDocuments(buildkitemojiraw);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateEmojiList.bind(this);
    this.animateCopy.bind(this);
  }
  state = {
    buildkitemojiraw,
    clickedIndex : -1
  }
  updateEmojiList = (event) => {
    const searchString = event.target.value;
    console.log(searchString.length);
    this.setState({
      buildkitemojiraw: searchString.length > 0 ? search.search(searchString) : buildkitemojiraw
    })
  }
  animateCopy = (index) => {
    this.setState({
      clickedIndex:index
    });
  }
  render = () => {
    const { buildkitemojiraw, clickedIndex } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Buildkite Emoji Searcher</h1>
          <hr />
          <p>
            <label htmlFor="emoji-search"><FaSearch /></label>
            <input id="emoji-search" onChange={this.updateEmojiList} />
          </p>
          <ListGroup variant="flush" style={{ color: "black", minWidth:"60%"}}>
            {buildkitemojiraw.map(({ imgTag, emojiName }, idx) => (
              <ListGroup.Item key={idx}>
                <div style={{ float: "left" }}>
                  <LazyLoad>
                    <Markup content={imgTag} />
                  </LazyLoad>
                </div>
                <div style={{ float: "right" }}>
                  <CopyToClipboard text={emojiName.split(',')[0]}>
                    {
                      idx===clickedIndex ? 
                      (<FaCheckCircle />) :
                      (<FaCopy onClick={() => {
                        this.animateCopy(idx)
                        setTimeout(
                          this.animateCopy(-1),
                          3000
                        )
                      }}/>)
                    } 
                  </CopyToClipboard>
                </div>
                <div style={{ float: "center" }}>
                  <div>
                    {emojiName}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </header>
      </div>
    );
  }
}

export default App;
