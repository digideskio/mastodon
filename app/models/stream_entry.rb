class StreamEntry < ApplicationRecord
  include Paginable

  belongs_to :account, inverse_of: :stream_entries
  belongs_to :activity, polymorphic: true

  belongs_to :status,    foreign_type: 'Status',    foreign_key: 'activity_id'
  belongs_to :follow,    foreign_type: 'Follow',    foreign_key: 'activity_id'
  belongs_to :favourite, foreign_type: 'Favourite', foreign_key: 'activity_id'

  validates :account, :activity, presence: true

  STATUS_INCLUDES = [:account, :stream_entry, :media_attachments, mentions: :account, reblog: [:stream_entry, :account, mentions: :account], thread: [:stream_entry, :account]].freeze

  scope :with_includes, -> { includes(:account, status: STATUS_INCLUDES, favourite: [:account, :stream_entry, status: STATUS_INCLUDES], follow: [:target_account, :stream_entry]) }

  def object_type
    orphaned? ? :activity : (targeted? ? :activity : activity.object_type)
  end

  def verb
    orphaned? ? :delete : activity.verb
  end

  def targeted?
    [:follow, :share, :favorite].include? verb
  end

  def target
    orphaned? ? nil : activity.target
  end

  def title
    orphaned? ? nil : activity.title
  end

  def content
    orphaned? ? nil : activity.content
  end

  def threaded?
    (verb == :favorite || object_type == :comment) && !thread.nil?
  end

  def thread
    orphaned? ? nil : activity.thread
  end

  def mentions
    activity.respond_to?(:mentions) ? activity.mentions.map(&:account) : []
  end

  def activity
    send(activity_type.downcase.to_sym)
  end

  private

  def orphaned?
    activity.nil?
  end
end
