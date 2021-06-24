import {
  ReactiveBase,
  DataSearch,
  MultiList,
  ReactiveList,
  ResultList,
  RatingsFilter,
} from "@appbaseio/reactivesearch";
import { ReactiveOpenStreetMap } from "@appbaseio/reactivemaps";

import "./App.css";

const { ResultListWrapper } = ReactiveList;

export default function App() {
  const handleOnPopoverClick = (marker) => {
    return (
      <div
        className="row"
        style={{ margin: "0", maxWidth: "300px", paddingTop: 10 }}
      >
        <div className="col s12">
          <div>
            <strong>{marker.name}</strong>
          </div>
          <p style={{ margin: "5px 0", lineHeight: "18px" }}>
            {marker.address}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <ReactiveBase
        app="yelp"
        url="https://b23hCea0c:12128fa4-9d88-417c-9a25-cc357b31d409@business-data-zqymdyz-arc.searchbase.io"
      >
        <nav
          style={{
            padding: "10px 20px",
            background: "#efefef",
            height: 70,
            display: "flex",
            alignItems: "center",
            fontSize: 18,
            fontWeight: "bolder",
            justifyContent: "space-between",
          }}
        >
          <div>GoFind</div>
          <DataSearch
            componentId="SearchSensor"
            dataField={["name", "name.search", "name.autosuggest"]}
            onValueSelected={(value, cause, source) => {
              console.log("Selected value", value);
              console.log("selected obj", source);
            }}
            fieldWeights={[3, 1, 1, 2, 1, 1]}
            style={{ width: "70%" }}
          />
        </nav>
        <div style={{ display: "flex" }}>
          <div style={{ width: "30%" }}>
            <MultiList
              componentId="CategoriesSensor"
              dataField="categories.keyword"
              placeholder="Search Category"
              URLParams={true}
            />
            <MultiList
              componentId="CitySensor"
              dataField="city.keyword"
              placeholder="Search City"
              URLParams={true}
            />
            <RatingsFilter
              componentId="RatingsSensor"
              dataField="stars"
              title="Ratings Filter"
              data={[
                { start: 4, end: 5, label: "4 stars and up" },
                { start: 3, end: 5, label: "3 stars and up" },
                { start: 2, end: 5, label: "2 stars and up" },
                { start: 1, end: 5, label: "> 1 stars" },
              ]}
            />
          </div>
          <div style={{ width: "70%" }}>
            <div style={{ display: "flex", position: "relative" }}>
              <ReactiveList
                style={{ maxHeight: "100vh", width: "60%", overflow: "scroll" }}
                componentId="result"
                react={{
                  and: [
                    "SearchSensor",
                    "CategoriesSensor",
                    "RatingsSensor",
                    "CitySensor",
                  ],
                }}
                dataField="location"
                renderItem={(item) => <div>{item.name}</div>}
                pagination
                size={6}
                render={({ loading, error, data }) => {
                  if (loading) {
                    return <div>Fetching Results</div>;
                  }
                  if (error) {
                    return (
                      <div>
                        Something Went Wrong! Error details
                        {JSON.stringify(error)}
                      </div>
                    );
                  }
                  return (
                    <ResultListWrapper>
                      {data.map((item) => (
                        <ResultList key={item._id}>
                          <ResultList.Image src={item.image} />
                          <ResultList.Content>
                            <ResultList.Title
                              dangerouslySetInnerHTML={{
                                __html: item.name,
                              }}
                            />
                            <ResultList.Description
                              style={{ textAlign: "left" }}
                            >
                              <div>
                                <div>
                                  <b>Address: </b> {item.address}
                                </div>
                                <div>
                                  <b>City: </b> {item.city}
                                </div>
                                <div>
                                  <b>Review Count: </b> {item.review_count}
                                </div>
                                <div>
                                  <b>Stars: </b> {item.stars}
                                </div>
                                <div>
                                  <b>Categories: </b>
                                  {item.categories}
                                </div>
                              </div>
                            </ResultList.Description>
                          </ResultList.Content>
                        </ResultList>
                      ))}
                    </ResultListWrapper>
                  );
                }}
              />
              <ReactiveOpenStreetMap
                style={{
                  width: "40%",
                  height: "100vh",
                  position: "relative",
                  right: 0,
                  top: 0,
                }}
                componentId="MapUI"
                dataField="location"
                title="Venue Location Map"
                renderData={(result) => ({
                  icon: "https://i.imgur.com/NHR2tYL.png",
                })}
                onPopoverClick={(data) => handleOnPopoverClick(data)}
                react={{
                  and: [
                    "SearchSensor",
                    "CategoriesSensor",
                    "RatingsSensor",
                    "CitySensor",
                  ],
                }}
                defaultZoom={11}
              />
            </div>
          </div>
        </div>
      </ReactiveBase>
    </div>
  );
}
