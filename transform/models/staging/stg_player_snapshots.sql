with source as (
    select * from {{ source('raw', 'player_snapshots') }}
),

renamed as (
    select
        app_id,
        current_players,
        captured_at::timestamptz as captured_at,
        captured_at::date as snapshot_date
    from source
)

select * from renamed