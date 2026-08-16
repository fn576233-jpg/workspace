import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { EmptyState } from './EmptyState'
import { FilmIcon } from './icons'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('HeroReel error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg px-4 py-20">
          <EmptyState
            icon={<FilmIcon className="h-12 w-12" />}
            title="Something went wrong"
            description="An unexpected error occurred while loading this section. Please try refreshing the page."
            action={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-red cursor-pointer px-5 py-2.5 text-sm"
              >
                Reload page
              </button>
            }
          />
        </div>
      )
    }
    return this.props.children
  }
}
