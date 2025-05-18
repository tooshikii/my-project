export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart cards will be added here */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Coding Hours</h2>
          <p className="text-gray-600 dark:text-gray-300">Chart coming soon...</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <p className="text-gray-600 dark:text-gray-300">Chart coming soon...</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Coverage</h2>
          <p className="text-gray-600 dark:text-gray-300">Chart coming soon...</p>
        </div>
      </div>
    </div>
  )
} 