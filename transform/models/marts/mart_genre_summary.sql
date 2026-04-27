with games as (
    select * from {{ ref('dim_games') }}
),

genres as (
    select 
        gd.app_id,
        genre.value as genre
    from {{ source('raw', 'game_details') }} gd
    join {{ source('raw', 'game_details__genres') }} genre 
        on genre._dlt_parent_id = gd._dlt_id
),

joined as (
    select
        g.genre,
        count(distinct d.app_id) as game_count,
        round(avg(d.positive_pct), 1) as avg_positive_pct,
        round(avg(d.price_usd), 2) as avg_price_usd,
        sum(d.current_players) as total_current_players,
        round(avg(d.avg_playtime_hrs)::numeric, 1) as avg_playtime_hrs
    from genres g
    join games d on g.app_id = d.app_id
    where g.genre is not null
    group by g.genre
)

select * from joined
order by total_current_players desc