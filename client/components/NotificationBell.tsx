"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/context/NotificationContext'

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-zinc-700 hover:bg-zinc-100 transition"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-xl bg-white shadow-2xl border border-zinc-200 z-50 max-h-[500px] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-zinc-200 px-4 py-3 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-pink-600 hover:text-pink-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-zinc-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                  <svg className="h-6 w-6 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <p className="text-sm text-zinc-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => {
                // Determine the link based on notification type
                let href = '/dashboard'
                if (notification.type === 'follow' && notification.data?.followerId) {
                  href = `/profile/${notification.data.followerId}`
                } else if (notification.type === 'event_rsvp' && notification.data?.eventId) {
                  href = `/events/${notification.data.eventId}`
                }

                // Get display name
                const displayName = notification.data?.followerName || notification.data?.eventTitle || 'Notification'
                const initial = displayName.slice(0, 2).toUpperCase()

                return (
                  <Link
                    key={notification.id}
                    href={href}
                    onClick={() => {
                      handleNotificationClick(notification.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition ${
                      !notification.read ? 'bg-pink-50' : ''
                    }`}
                  >
                    {/* Icon based on type */}
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {notification.type === 'follow' ? '👤' : notification.type === 'event_rsvp' ? '🎉' : initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-pink-500 mt-2"></div>
                    )}
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-zinc-200 px-4 py-3 rounded-b-xl">
              <Link
                href="/connections"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                View all connections
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
