import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, Timestamp, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changesDetalis, setChangeDetalis] = useState(false)
  const [formData, setFormData] = useState({  
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef, 
        where('userRef', '==', auth.currentUser.uid), 
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = (e) => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      console.log(error);
      toast.error('Colud not update profile detalis')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => 
        listing.id !== listingId
      )
      
      setListings(updatedListings)
      toast.success('Successfully delete listing!')
    }
  }

  return <div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button type='button' className='logOut' onClick={onLogout}>
        Logout
      </button>
    </header>

    <main>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'>Personal Details</p>
        <p className="changePersonalDetails" 
          onClick={() => {
            changesDetalis && onSubmit()
            setChangeDetalis((prevState) => !prevState)
        }}>
          {changesDetalis ? 'done' : 'change'}
        </p>
      </div>
      <div className="profileCard">
        <form>
          <input 
            type="text"
            id='name'
            className={!changesDetalis ? 'profileName' : 'profileNameActive'}
            disabled={!changesDetalis}
            value={name}
            onChange={onChange}
          />
          <input 
            type="email"
            id='email'
            className={!changesDetalis ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changesDetalis}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>

      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home' />
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt='arrow right' />
      </Link>

      {!loading && listings?.length > 0 && (
        <>
          <p className='listingsText'>Your Listings</p>
          <ul className='listingsList'>
            {listings.map((listing) => (
              <ListingItem 
                key={listing.id} 
                listing={listing.data} 
                id={listing.id} 
                onEdit={() => onEdit(listing.id)}
                onDelete={() => onDelete(listing.id)}
              />
            ))}
          </ul>
        </>
      )}

    </main>
  </div>
  

}

export default Profile
