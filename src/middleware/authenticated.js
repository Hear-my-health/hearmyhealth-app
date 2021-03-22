export default function ({ store, redirect }) {
  // If the user is not authenticated

  console.log('middleware authUser', store.state.authUser)
  console.log('middleware authenticated', store.state.authenticated)
/*   if (!store.state.authenticated) {
    return redirect('/login')
  } */
}
