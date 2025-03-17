'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import CodeEditor from '@/components/practice/CodeEditor';

// Exercise difficulty badge component
const DifficultyBadge = ({ level }) => {
  const colorMap = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[level] || 'bg-gray-100 text-gray-800'}`}>
      {level.charAt(0) + level.slice(1).toLowerCase()}
    </span>
  );
};

export default function PracticePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/practice/exercises');
        setExercises(data);

        // Select first exercise by default if none is selected
        if (data.length > 0 && !selectedExercise) {
          setSelectedExercise(data[0]);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load practice exercises');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [selectedExercise]);

  // Handle difficulty filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter exercises by difficulty
  const filteredExercises = exercises.filter((exercise) => {
    if (filter === 'ALL') return true;
    return exercise.difficultyLevel === filter;
  });

  // Handle exercise selection
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  // Handle submission completion
  const handleSubmissionComplete = (result) => {
    // Update UI based on submission result
    if (result.passed) {
      toast.success('Exercise completed successfully!');

      // Mark exercise as completed in the UI
      setExercises(exercises.map(ex =>
        ex.id === selectedExercise.id
          ? { ...ex, completed: true }
          : ex
      ));
    } else {
      toast.info('Keep trying. You\'re getting closer!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Exercise List Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow mb-6 md:mb-0 md:mr-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Coding Exercises</h2>
            <div className="mt-2">
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700">
                Filter by difficulty
              </label>
              <select
                id="difficulty-filter"
                value={filter}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedExercise?.id === exercise.id ? 'bg-indigo-50' : ''}`}
                    onClick={() => handleSelectExercise(exercise)}
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${exercise.completed ? 'text-green-600' : 'text-gray-900'}`}>
                          {exercise.title}
                          {exercise.completed && (
                            <span className="ml-2 text-green-500">✓</span>
                          )}
                        </p>
                        <DifficultyBadge level={exercise.difficultyLevel} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">
                  No exercises found with the selected filter.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Main Exercise Area */}
        <div className="flex-1">
          {selectedExercise ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">{selectedExercise.title}</h1>
                    <div className="mt-1 flex items-center">
                      <DifficultyBadge level={selectedExercise.difficultyLevel} />
                      {selectedExercise.lessonId && (
                        <Link
                          href={`/lessons/${selectedExercise.lessonId}`}
                          className="ml-3 text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          Related Lesson
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 prose max-w-none text-gray-700">
                  <p>{selectedExercise.description}</p>
                </div>
              </div>

              <CodeEditor
                exerciseId={selectedExercise.id}
                initialCode={selectedExercise.initialCode}
                testCases={selectedExercise.testCases}
                onSubmissionComplete={handleSubmissionComplete}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exercise selected</h3>
              <p className="text-gray-500">
                Please select an exercise from the list to start coding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}