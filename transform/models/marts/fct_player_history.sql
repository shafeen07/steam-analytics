with snapshots as (
    select * from {{ ref('stg_player_snapshots') }}
),

with_game as (
    select
        s.app_id,
        d.name as game_name,
        s.current_players,
        s.captured_at,
        s.snapshot_date
    from snapshots s
    left join {{ ref('dim_games') }} d on s.app_id = d.app_id
)

select * from with_game