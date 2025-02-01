const StayConnected = () => {
    return (


        <div class="py-16 bg-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-md mx-auto text-center">
            <h2 class="text-3xl font-bold mb-8">Stay connected with us</h2>
            <form class="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                class="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <input
                type="text"
                placeholder="Subject"
                class="w-full px-4 py-2 rounded-md text-gray-900"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                class="w-full px-4 py-2 rounded-md text-gray-900"
              ></textarea>
              <button type="submit" class="w-full bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    )
}
export default StayConnected