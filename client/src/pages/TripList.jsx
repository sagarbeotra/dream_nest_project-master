import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id); // Optional chaining to handle null/undefined
  const tripList = useSelector((state) => state.user?.tripList ?? []); // Default to empty array if tripList is null/undefined

  const dispatch = useDispatch();

  const getTripList = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching trip list for user:", userId);
      const response = await fetch(`http://localhost:3001/users/${userId}/trips`, {
        method: "GET",
      });

      const data = await response.json();
      console.log("Fetched data:", data);
      dispatch(setTripList(data));
    } catch (err) {
      console.error("Fetch Trip List failed!", err.message);
    } finally {
      setLoading(false); // Ensure loading state is updated even if fetch fails
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]); // Added userId as a dependency to rerun the effect if it changes

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => {
          if (!listingId || !hostId) {
            console.error("Invalid trip data:", { listingId, hostId });
            return null; // Skip rendering if data is invalid
          }

          return (
            <ListingCard
              key={listingId._id} // Ensure each child has a unique key prop
              listingId={listingId._id}
              creator={hostId._id}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              province={listingId.province}
              country={listingId.country}
              category={listingId.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
